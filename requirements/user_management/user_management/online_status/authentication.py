from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async

import logging

logging.basicConfig(level=logging.DEBUG)  

logger = logging.getLogger("online_status.authentication") 

class JwtAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        try :
            logger.debug("----------------------------------CALLED")
            token = self._get_token(scope)
            logger.debug("----------------------------------ttttttttt")
            user = await self._get_user(token)
            logger.debug(f"----------------{user}")
            scope["user"] = user

        except Exception as e:
            logger.debug(f"exxxx------------->{str(e)}")
            # scope["user"] = AnonymousUser()
            # return await super().__call__(scope, receive, send)
        return await super().__call__(scope, receive, send)
    
    
    def _get_token(self, scope):
        headers = dict(scope.get("headers", []))
        if not headers:
            raise Exception("absence of headers")
        auth_header = headers.get(b'authorization', b'').decode('utf-8')
        if not auth_header and not auth_header.startswith("Bearer"):
            raise Exception("invalid Authorization header")
        auth_header = auth_header.split(" ")
        if len(auth_header) != 2:
            raise Exception("absent token")
        return auth_header[1]
    
    @database_sync_to_async
    def _get_user(self, token):
        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            logger.debug(f"---------> user {user}")
            return user
        except Exception as e:
            logger.debug("---------> anonymous")
            return AnonymousUser()