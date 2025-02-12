import urllib.parse
import requests
from django.conf import settings
from game.models import Player
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware


# class AuthMiddleware( ):
# 	def __init__(self, app):
# 		self.app = app
  
# 	def __get_token( self, scope ):
# 		query_string = scope.get("query_string", b"").decode()
# 		params = urllib.parse.parse_qs(query_string)
# 		token = params.get("token", [None])[0]  
# 		return token

# 	def __is_authenticated( self, token, scope ):
# 		response = requests.get(
#     		settings.USER_INFO_URL + 'me', 
#     		headers={
#         		"Host": "localhost", 
#         		'authorization': f"Bearer {token}" 
#         	})
# 		if response.status_code != 200:
# 			return False
# 		user_info = response.json(  )
# 		scope['user_id'] = user_info.get('id')
# 		return True
    
		
		
# 	async def __call__(self, scope, receive, send):
# 		if scope['type'] == 'websocket':
# 			token = self.__get_token(scope)
# 			if not token:
# 				await send( {
# 					'type' : 'Error',
# 					'data' : 'Connection Erropr',
# 					'code' : 4001
# 				})
# 			is_authenticated = self.__is_authenticated( token, scope)
# 			if not is_authenticated:
# 				return 
		
# 			return await self.app(scope, receive, send)
	
class AuthMiddleware( BaseMiddleware ):  
	def __get_token( self, scope ):
		query_string = scope.get("query_string", b"").decode()
		params = urllib.parse.parse_qs(query_string)
		token = params.get("token", [None])[0]  
		return token

	def __is_authenticated( self, token, scope ):
		response = requests.get(
    		settings.USER_INFO_URL + 'me', 
    		headers={
        		"Host": "localhost", 
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
			if not token:
				await send( {
					'type' : 'Error',
					'data' : 'Connection Erropr',
					'code' : 4001
				})
			is_authenticated = self.__is_authenticated( token, scope)
			if not is_authenticated:
				return 
		
			return await super().__call__( scope, receive, send )
	
	