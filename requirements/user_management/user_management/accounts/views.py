import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from Profiles.models import Profile
from rest_framework.response import Response
import urllib
from rest_framework.views import APIView
from rest_framework import status, exceptions
from django.conf import settings
from .permissions import IsNotAuthenticated
from djoser.views import UserViewSet
import logging
import json
from djoser.serializers import UsernameSerializer
from rest_framework import generics

logging.basicConfig(level=logging.DEBUG)  

logger = logging.getLogger("accounts.views") 
User = get_user_model()

class   Error(exceptions.APIException):
    
    def __init__(self, detail, status_code):
        self.detail = detail
        self.status_code = status_code
        super().__init__(self.detail)


class   UserUsrnameUpdateApiView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UsernameSerializer

    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        instance = serializer.save()
        try :
            response = requests.post(f"{settings.UPDATE_PLAYER_URL}/{instance.id}", data={"username": instance.username}, headers={"Host":"localhost"})
            response.raise_for_status()
        except requests.exceptions.HTTPError as http_err:
            logger.debug("---------------entered here--------------")
            raise Error(detail="error in the new_player response", status_code=http_err.response.status_code)
        except requests.RequestException as e:
            raise Error(detail=str(e), code=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            raise exceptions.APIException(detail=str(e))
    

set_username_api_view = UserUsrnameUpdateApiView.as_view()

class   CustomUserViewSet(UserViewSet):
    def perform_create(self, serializer):
        instance = serializer.save()
        try :
            response = requests.post(settings.NEW_PLAYER_URL, data={"userId": instance.id, "username": instance.username}, headers={"Host":"localhost"})
            response.raise_for_status()
        except requests.exceptions.HTTPError as http_err:
            raise Error(detail="error in the new_player response", status_code=http_err.response.status_code)
        except requests.RequestException as e:
            raise Error(detail=str(e), code=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            raise exceptions.APIException(detail=str(e))


class   IntraAuth(APIView):
    
    permission_classes = [IsNotAuthenticated]
    
    def get(self, request):
        
        params = {
            "client_id": settings.UID,
            "redirect_uri": f"{request.scheme}://{request.get_host()}",
            "response_type": "code",
            "scope": "public"
            }
        
        auth_url = settings.INTRA_AUTH_URL + '?' + urllib.parse.urlencode(params)
        return Response({"intra_auth_url": auth_url}, status=status.HTTP_200_OK)

intra_auth_view = IntraAuth.as_view()


class   IntraCallback(APIView):
    
    permission_classes = [IsNotAuthenticated]
    
    def post(self, request):

        try:
            body = request.body.decode('utf-8')
            data = json.loads(body)
            code = data.get('code', '')
            if not code:
                return Response({"detail": "missing code"}, status= status.HTTP_400_BAD_REQUEST)
            access_token = self.exchange_code(request, code)
            user_data = self.get_user_data(access_token)
            user_profile =  Profile.objects.filter(oauth2_id=user_data.get("id")).first()
            if user_profile:
                intra_user = User.objects.filter(profile=user_profile).first()
            if not user_profile:
                intra_user, created = User.objects.get_or_create(username=user_data.get("username"))
                if not created:
                    return Response({'detail': f"A user with the username '{intra_user.username}' already exists and does not use OAuth."}, status=status.HTTP_400_BAD_REQUEST)
                user_profile = Profile.objects.create(user=intra_user, image_url = user_data.get("image_url"), is_oauth2=True, oauth2_id=user_data.get("id"))
                response = requests.post(settings.NEW_PLAYER_URL, data = {"userId": intra_user.id, "username": intra_user.username}, headers={"Host":"localhost"})
                if response.status_code != status.HTTP_200_OK:
                    return Response({'detail':"error in the new_player response"}, status=response.status_code)
            refresh = RefreshToken.for_user(intra_user)
            access = refresh.access_token
        except json.JSONDecodeError:
            return Response({'detail': 'Invalid JSON data'}, status=status.HTTP_400_BAD_REQUEST)
        except Error as e:
            return Response({"detail": str(e.detail)}, status=e.status_code)
        except requests.exceptions.RequestException as e:
            return Response({"detail": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({"detail": f"Internal server error {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"refresh": str(refresh), "access": str(access)}, status=status.HTTP_200_OK)
    
    
    def exchange_code(self, request, code):
        
        data = {
            "client_id": settings.UID,
            "client_secret": settings.SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": f"{request.scheme}://{request.get_host()}",
        }
        headers = {
            "Content-type": 'application/x-www-form-urlencoded'
        }
        
        try:
            response = requests.post(settings.INTRA_TOKEN_URI, data=data, headers=headers)
            response.raise_for_status()
            credentials = response.json()
            access_token = credentials.get('access_token')
            if not access_token:
                raise Error('No access token in response', status.HTTP_401_UNAUTHORIZED)
        
        except requests.exceptions.HTTPError as http_err:
            raise Error(f"code exchange with access token failed {str(http_err)}", http_err.response.status_code)
        except requests.exceptions.RequestException as e:
            raise Error(str(e), status.HTTP_503_SERVICE_UNAVAILABLE)
        
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
                "id" : user_info.get("id"),
                "username" : user_info.get("login"),
                "image_url" : user_info.get("image").get("versions").get("medium")
            }
        
        except requests.exceptions.HTTPError as http_err:
            raise Error(f"getting user info failed {str(http_err)}", http_err.response.status_code)
        except requests.exceptions.RequestException as e:
            raise Error(str(e), status.HTTP_503_SERVICE_UNAVAILABLE)
        except KeyError as key_err:
            raise Error(f"Invalid user info structure received {str(key_err)}", status.HTTP_500_INTERNAL_SERVER_ERROR)
        return data

intra_callback_view = IntraCallback.as_view()
