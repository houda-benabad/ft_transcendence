# from rest_framework.views import APIView
from adrf.views import APIView
import httpx
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
# import requests
import logging
logging.basicConfig(level=logging.DEBUG)  

logger = logging.getLogger("accounts.views")  


class   AuthTokenError(Exception):
    
    def __init__(self, message, status_code):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class	ProfileWithGameHistoryView(APIView):
    
    async def get(self, request, *args, **kwargs):
        try:
            user_id = kwargs.get('user_id')
            auth_token = request.headers.get('Authorization')
            token = await self._validate_authorization_header(auth_token)
            token_validation = await self._validate_token(token)
            if token_validation[1] != 200:
                raise AuthTokenError(message=token_validation[0]['detail'], status_code=token_validation[1])
            if user_id:
                logger.debug("start fetch")
                async with httpx.AsyncClient() as client:
                    logger.debug("fetch user_profile")
                    user_profile_response = await client.get(f"{settings.USER_PROFILE_URL}/{user_id}", headers={"Authorization": auth_token, "Host": "localhost"})
                    logger.debug("user_profile fetched")
                    game_history_response = await client.get(f"{settings.GAME_HISTORY_URL}/{user_id}", headers={"Host": "localhost"})
                    logger.debug("game_history fetched")
            if user_profile_response.status_code != 200:
                return Response({"detail": "Failed to retrieve user profile "}, status=user_profile_response.status_code)
            if game_history_response.status_code != 200:
                return Response({"detail": "Failed to retrieve game history"}, status=game_history_response.status_code)
            response = {
                "user_profile": user_profile_response.json(),
                "game_history": game_history_response.json()
            }
            return Response(response, status=status.HTTP_200_OK)
        except httpx.RequestError as e:
            return Response({"detail": f"An error occurred while fetching data in aggregation data user_profile and game_history: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except httpx.HTTPStatusError as e:
            return Response({"detail": f"Received error from game service or user_management service: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
        except AuthTokenError as e:
            return Response({"detail": str(e.message)}, status=e.status_code)
        except Exception as e:
            return Response({"detail": f" an unecpected error occured {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def _validate_authorization_header(self, auth_token):
        if not auth_token or not auth_token.startswith("Bearer"):
            raise AuthTokenError(message="Authorization header missing", status_code=401)
        token = auth_token.split(" ")
        if len(token) == 1:
            raise AuthTokenError(message="missing token", status_code=401)
        return token[1]
        
            
    async def _validate_token(self, token):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "http://user_management:8000/auth/jwt/verify/",
                    json={"token": token},
                    headers={"Host": "localhost"}
                )
                logger.debug("validated token")
                return (response.json(), response.status_code)
        except httpx.RequestError as e:
            return Response({"detail": "Token validation failed"}, 500)
        except httpx.RequestError as e:
            return Response({"detail": f"An error occurred while calling user_management service for verifying token {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except httpx.HTTPStatusError as e:
            return Response({"detail": f"Received error from user_management service: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

profile_game_history_view = ProfileWithGameHistoryView.as_view()
