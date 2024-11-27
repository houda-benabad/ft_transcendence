from django.shortcuts import redirect
import requests
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from Profiles.models import Profile
from django.http import JsonResponse
from rest_framework.response import Response
import urllib

UID= "u-s4t2ud-4e0040e091261200ad3133c430908cc0f4fa293d4c3b73e39819835cf81d5de5"
SECRET = "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"
intraAuthUrl = "https://api.intra.42.fr/oauth/authorize"
redirectUri = "https://localhost/auth/oauth2/callback"
intraTokenUri = "https://api.intra.42.fr/oauth/token"
userInfoUri = "https://api.intra.42.fr/v2/me"

def intraLogin(request):
    params = {
        "client_id": UID,
        "redirect_uri": redirectUri,
        "response_type": "code"
    }
    authUrl = intraAuthUrl + '?' + urllib.parse.urlencode(params)
    return redirect(authUrl)
        

def intraLoginRedirect(request):
    code=request.GET.get('code')
    acc_token = exchangeCode(code)
    user_data = getUserData(acc_token)
    intraUser = User.objects.get_or_create(username=user_data["username"])
    token = Token.objects.get_or_create(user=intraUser[0])
    Profile.objects.get_or_create(user=intraUser[0], image_url = user_data["image_url"])
    return JsonResponse({"auth_token":token[0].key})

def exchangeCode(code: str):
    data = {
        "client_id": UID,
        "client_secret": SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirectUri,
        "scope": "public"
    }
    headers = {
        "Content-type": 'application/x-www-form-urlencoded'
    }
    try:
        response = requests.post(intraTokenUri, data=data, headers=headers)
        if response.status_code == 200:
            credentials = response.json()
            access_token = credentials['access_token']
            if access_token:
                return access_token
            return JsonResponse({'Error': 'No access token in response'}, status=500)
        return JsonResponse({"Error": "code exchange failed"}, status=response.status_code)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"Error": str(e)})


def getUserData(acc_token):
    headers = {
        'authorization': 'Bearer %s' % acc_token
    }
    try:
        response = requests.get(userInfoUri, headers=headers)
        if response.status_code == 200:
            user_info = response.json()
            data = {
                "username" : user_info["login"],
                "image_url" : ((user_info["image"])["versions"])["medium"]
            }
            return data
        return JsonResponse({"Error": "getting user info failed"}, status=response.status_code)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"Error": str(e)})
    
