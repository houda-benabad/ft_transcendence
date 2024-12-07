from django.shortcuts import redirect
import requests
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from Profiles.models import Profile
from rest_framework.response import Response
import urllib
from rest_framework.views import APIView
from rest_framework import status, permissions
from django.conf import settings
from django.urls import reverse

class   IntraAuth(APIView):
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        
        params = {
            "client_id": settings.UID,
            "redirect_uri": request.build_absolute_uri(reverse('intra-callback')),
            "response_type": "code",
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
            error = request.GET.get('error')
            return Response({"detail": error}, status= status.HTTP_400_BAD_REQUEST)
        
        try:
            access_token = self.exchange_code(request, code)
            user_data = self.get_user_data(access_token)
            intraUser = User.objects.get_or_create(username=user_data["username"])
            token = Token.objects.get_or_create(user=intraUser[0])
            Profile.objects.get_or_create(user=intraUser[0], image_url = user_data["image_url"])
            
        except OAuthError as e:
            return Response({"detail": str(e.message)}, status=e.status_code)

        return Response({"auth_token": token[0].key})
    
    def exchange_code(self, request, code):
        
        data = {
            "client_id": settings.UID,
            "client_secret": settings.SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": request.build_absolute_uri(reverse('intra-callback')),
            "scope": "public"
        }
        headers = {
            "Content-type": 'application/x-www-form-urlencoded'
        }
        
        try:
            response = requests.post(settings.INTRA_TOKEN_URI, data=data, headers=headers)
            if response.status_code != 200:
                raise OAuthError("code exchange with access token failed", response.status_code)
            credentials = response.json()
            access_token = credentials['access_token']
            if not access_token:
                raise OAuthError('No access token in response', 401)
        
        except requests.exceptions.RequestException as e:
            raise OAuthError(str(e), 503)
        
        return access_token
        
        
    def get_user_data(self, access_token):
        
        headers = {
            'authorization': 'Bearer %s' % access_token
            }
        
        try:
            response = requests.get(settings.USER_INFO_URI, headers=headers)
            if response.status_code != 200:
                raise OAuthError("getting user info failed", response.status_code)
            user_info = response.json()
            data = {
                "username" : user_info["login"],
                "image_url" : ((user_info["image"])["versions"])["medium"]
            }
        
        except requests.exceptions.RequestException as e:
            raise OAuthError(str(e), 503)
        
        return data

intra_callback_view = IntraCallback.as_view()

