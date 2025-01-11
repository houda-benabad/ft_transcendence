from rest_framework import permissions
import requests
from django.conf import settings
from rest_framework.response import Response
from game.models import Player

class AuthenticationUsingJWT( permissions.BasePermission ):
	def has_permission( self, request, view ):
		token = request.headers.get( 'Authorization' )
		print( "token = ", token )
		response = requests.get( settings.USER_INFO_URL + 'me', headers={"Host": "localhost", 'Authorization': token })
		if response.status_code != 200:
			return False
			
		request.user_info = response.json(  )
		return True