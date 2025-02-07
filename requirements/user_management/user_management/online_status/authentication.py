from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
import logging

logging.basicConfig(level=logging.DEBUG)  

logger = logging.getLogger("online_status.authentication") 

class JwtAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
<<<<<<< HEAD
        try :
            token = self._get_token(scope)
=======
        token = self._get_token(scope)
        if not token:
            scope["user"] = AnonymousUser()
        else:
>>>>>>> online_status_frontend
            user = await self._get_user(token)
            scope["user"] = user
        return await super().__call__(scope, receive, send)
    
    
    def _get_token(self, scope):

        query_string = scope.get('query_string')
        if not query_string:
            return None
        query_params = parse_qs(query_string.decode('utf-8'))
        token = query_params.get('token', [None])[0]
        if not token:
            return None
        return token
    
    @database_sync_to_async
    def _get_user(self, token):
        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            return user
        except Exception as e:
            return AnonymousUser()