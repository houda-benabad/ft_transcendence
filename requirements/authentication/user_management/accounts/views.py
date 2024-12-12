from django.shortcuts import redirect
import requests
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from Profiles.models import Profile
from rest_framework.response import Response
import urllib
from rest_framework.views import APIView
from rest_framework import status, permissions
from django.conf import settings
from django.urls import reverse

User = get_user_model()

class   IntraAuth(APIView):
    
    permission_classes = [permissions.AllowAny]
    
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


class   OAuthError(Exception):
    
    def __init__(self, message, status_code):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class   IntraCallback(APIView):
    
    permission_classes = [permissions.AllowAny]
    
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
            if not created and user_profile and not user_profile.is_oauth2:
                raise OAuthError(f"A user with the username '{intra_user.username}' already exists and does not use OAuth.", status.HTTP_400_BAD_REQUEST)
            if user_profile:
                user_profile.image_url = user_data["image_url"]
                user_profile.save()
            else:
                Profile.objects.create(user=intra_user, image_url = user_data["image_url"], is_oauth2=True)
            token, created = Token.objects.get_or_create(user=intra_user)
        except OAuthError as e:
            return Response({"detail": str(e.message)}, status=e.status_code)
        except Exception as e:  
            return Response({"detail": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"auth_token": token.key}, status=status.HTTP_200_OK)
    
    
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
        
        except requests.exceptions.HTTPError as http_err:
            raise OAuthError("code exchange with access token failed", http_err.response.status_code)
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
        
        except requests.exceptions.HTTPError as http_err:
            raise OAuthError("getting user info failed", http_err.response.status_code)
        except requests.exceptions.RequestException as e:
            raise OAuthError(str(e), status.HTTP_503_SERVICE_UNAVAILABLE)
        except KeyError as key_err:
            raise OAuthError(f"Invalid user info structure received {str(key_err)}", status.HTTP_500_INTERNAL_SERVER_ERROR)
        return data

intra_callback_view = IntraCallback.as_view()

