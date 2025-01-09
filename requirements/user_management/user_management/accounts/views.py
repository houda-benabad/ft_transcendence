from django.shortcuts import redirect
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from Profiles.models import Profile
from rest_framework.response import Response
import urllib
from rest_framework.views import APIView
from rest_framework import status, permissions, exceptions
from django.conf import settings
from django.urls import reverse
from .permissions import IsNotAuthenticated
from djoser.views import UserViewSet
import logging

logging.basicConfig(level=logging.DEBUG)  

logger = logging.getLogger("accounts.views") 
User = get_user_model()

class   OAuthError(Exception):
    
    def __init__(self, detail, status_code):
        self.detail = detail
        self.status_code = status_code
        super().__init__(self.detail)

class Error(exceptions.APIException):

    def __init__(self, detail, status_code):
        self.detail = detail
        self.status_code = status_code
        super().__init__(self.detail)

class   CustomUserViewSet(UserViewSet):
    
    def perform_create(self, serializer):
        instance = serializer.save()
        try :
            response = requests.post("http://game:8000/api/game/new_player", data = {"userId": instance.id, "username": instance.username}, headers={"Host":"localhost"})
            if response.status_code != status.HTTP_200_OK:
                raise Error(detail="error in the new_player response", status_code = response.status_code)
        except requests.RequestException as e:
            raise Error(detail=str(e), status_code=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            raise Error(detail=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


class   IntraAuth(APIView):
    
    permission_classes = [IsNotAuthenticated]
    
    def get(self, request):
        
        params = {
            "client_id": settings.UID,
            "redirect_uri": request.build_absolute_uri(reverse('intra-callback')),
            "response_type": "code",
            "scope": "public"
            }
        
        auth_url = settings.INTRA_AUTH_URL + '?' + urllib.parse.urlencode(params)
        return redirect(auth_url)

intra_auth_view = IntraAuth.as_view()


class   IntraCallback(APIView):
    
    permission_classes = [IsNotAuthenticated]
    
    def get(self, request):
        
        code = request.GET.get('code')
        
        if not code:
            error = request.GET.get('error', 'Unknown error')
            return Response({"detail": error}, status= status.HTTP_400_BAD_REQUEST)
        
        try:
            access_token = self.exchange_code(request, code)
            user_data = self.get_user_data(access_token)
            intra_user, created = User.objects.get_or_create(username=user_data["username"])
            user_profile = Profile.objects.filter(user=intra_user).first()
            if user_profile :
                if not user_profile.is_oauth2:
                    raise OAuthError(f"A user with the username '{intra_user.username}' already exists and does not use OAuth.", status.HTTP_400_BAD_REQUEST)
                user_profile.image_url = user_data["image_url"]
                user_profile.save()
            else:
                Profile.objects.create(user=intra_user, image_url = user_data["image_url"], is_oauth2=True)
            refresh = RefreshToken.for_user(intra_user)
            access = refresh.access_token
        except OAuthError as e:
            return Response({"detail": str(e.detail)}, status=e.status_code)
        except Exception as e:  
            return Response({"detail": f"Internal server error {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"refresh": str(refresh), "access": str(access)}, status=status.HTTP_200_OK)
    
    
    def exchange_code(self, request, code):
        
        data = {
            "client_id": settings.UID,
            "client_secret": settings.SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": request.build_absolute_uri(reverse('intra-callback')),
        }
        headers = {
            "Content-type": 'application/x-www-form-urlencoded'
        }
        
        try:
            response = requests.post(settings.INTRA_TOKEN_URI, data=data, headers=headers)
            response.raise_for_status()
            credentials = response.json()
            access_token = credentials['access_token']
            if not access_token:
                raise OAuthError('No access token in response', status.HTTP_401_UNAUTHORIZED)
        
        except requests.exceptions.HTTPOAuthError as http_err:
            raise OAuthError(f"code exchange with access token failed {str(HTTPOAuthError)}", http_err.response.status_code)
        except requests.exceptions.RequestException as e:
            raise OAuthError(str(e), status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return access_token
        
        
    def get_user_data(self, access_token):
        
        headers = {
            'authorization': 'Bearer %s' % access_token
            }
        
        try:
            response = requests.get(settings.USER_INFO_URI, headers=headers)
            response.raise_for_status()
            user_info = response.json()
            data = {
                "username" : user_info["login"],
                "image_url" : ((user_info["image"])["versions"])["medium"]
            }
        
        except requests.exceptions.HTTPOAuthError as http_err:
            raise OAuthError(f"getting user info failed {str(http_err)}", http_err.response.status_code)
        except requests.exceptions.RequestException as e:
            raise OAuthError(str(e), status.HTTP_503_SERVICE_UNAVAILABLE)
        except KeyOAuthError as key_err:
            raise OAuthError(f"Invalid user info structure received {str(key_err)}", status.HTTP_500_INTERNAL_SERVER_ERROR)
        return data

intra_callback_view = IntraCallback.as_view()
