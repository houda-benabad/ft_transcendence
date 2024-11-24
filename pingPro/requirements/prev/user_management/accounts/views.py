from django.shortcuts import redirect
import requests
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from Profiles.models import Profile
from django.http import JsonResponse

UID = "u-s4t2ud-4e0040e091261200ad3133c430908cc0f4fa293d4c3b73e39819835cf81d5de5"

SECRET = "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"



intraAuthUrl = f"https://api.intra.42.fr/oauth/authorize?client_id={UID}&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Foauth2%2Flogin%2Fredirect&response_type=code&scope=public"

def intraLogin(request):
    return redirect(intraAuthUrl)

def exchangeCode(code: str):
    data = {
        "client_id": UID,
        "client_secret": SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:8000/oauth2/login/redirect",
        "scope": "public"
    }
    headers = {
        "Content-type": 'application/x-www-form-urlencoded'
    }
    response = requests.post('https://api.intra.42.fr/oauth/token', data=data, headers=headers)
    credentials = response.json()
    return credentials['access_token']

def getUserData(acc_token):
    response = requests.get("https://api.intra.42.fr/v2/me", headers={
        'authorization': 'Bearer %s' % acc_token
    })
    user_info = response.json()
    data = {
		"username" : user_info["login"],
		"image_url" : ((user_info["image"])["versions"])["medium"]
	}
    return data

def intraLoginRedirect(request):
    code=request.GET.get('code')
    acc_token = exchangeCode(code)
    user_data = getUserData(acc_token)
    intraUser = User.objects.get_or_create(username=user_data["username"])
    token = Token.objects.get_or_create(user=intraUser[0])
    Profile.objects.get_or_create(user=intraUser[0], image_url = user_data["image_url"])
    return JsonResponse({"auth_token":token[0].key})