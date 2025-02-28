import urllib.parse
import requests
from django.conf import settings
from game.models import Player
from channels.middleware import BaseMiddleware

class AuthMiddleware( BaseMiddleware ):  
	def __get_token( self, scope ):
		query_string = scope.get("query_string", b"").decode()
		params = urllib.parse.parse_qs(query_string)
		token = params.get("token", [None])[0]  
		return token

	def __get_host( self, scope):
		headers = scope.get("headers", {})[0]
		host = headers[1]
		if host:
			return host.decode()
		return None

	def __is_authenticated( self, token, host, scope ):
		response = requests.get(
    		settings.USER_INFO_URL + 'me', 
    		headers={
        		"Host": host, 
        		'authorization': f"Bearer {token}" 
        	})
		if response.status_code != 200:
			return False
		user_info = response.json(  )
		scope['user_id'] = user_info.get('id')
		return True
    
		
		
	async def __call__(self, scope, receive, send):
		if scope['type'] == 'websocket':
			token = self.__get_token(scope)
			host = self.__get_host( scope)
			if not token or not host:
				return 
			if not token:
				await send( {
					'type' : 'error',
					'data' : 'Connection Erropr',
					'code' : 4001
				})
			is_authenticated = self.__is_authenticated( token, host, scope)
			if not is_authenticated:
				return 
		
			return await super().__call__( scope, receive, send )
	
	