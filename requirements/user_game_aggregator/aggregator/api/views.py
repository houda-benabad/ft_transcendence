
from adrf.views import APIView
import httpx
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
import logging
from django.urls import resolve
from urllib.parse import urlparse, urlunparse
logging.basicConfig(level=logging.DEBUG)  
logger = logging.getLogger("accounts.views")

class   Error(Exception):
    
    def __init__(self, message, status_code):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class	ProfileWithGameHistoryView(APIView):

    async def get(self, request, *args, **kwargs):

        try:
            auth_token = request.headers.get('Authorization')
            token = self._validate_authorization_header(auth_token)
            await self._validate_token(token)
            user_id = kwargs.get('user_id', None)
            user_profile_data, game_history_data = await self._get_responses(request, auth_token, user_id)
            combined_response = self._edit_combine_responses(user_profile_data, game_history_data)
            return Response(combined_response, status=status.HTTP_200_OK)
        except httpx.RequestError as e:
            return Response({"detail": f"An error occurred while fetching data in aggregation data user_profile and game_history: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except httpx.HTTPStatusError as e:
            return Response({"detail": f"Received error from game service or user_management service: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
        except Error as e:
            return Response({"detail": str(e.message)}, status=e.status_code)
        except Exception as e:
            return Response({"detail": f" an unexpected error occured {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _edit_combine_responses(self, user_profile_data, game_history_data):

        game_history_data['general_details']['friends_count'] = user_profile_data['friends_count']
        user_profile_data.pop('friends_count', None)
        combined_response = {
            **user_profile_data,
            **game_history_data
        }
        return combined_response

    async def _get_responses(self, request, auth_token, user_id):

        is_other_user = request.resolver_match.url_name == "other_user_detailed_profile"
        user_profile_url = f"{settings.USER_PROFILE_URL}/{user_id if is_other_user else 'me'}"
        game_history_url = f"{settings.GAME_HISTORY_URL}/{user_id if is_other_user else 'me'}"
        headers = {"Authorization": auth_token, "Host": request.get_host(), "X-Protocol": request.scheme} 
        async with httpx.AsyncClient() as client:
            user_profile_response = await client.get(user_profile_url, headers=headers)
            game_history_response = await client.get(game_history_url, headers=headers)
        if user_profile_response.status_code != status.HTTP_200_OK:
            raise Error("Failed to retrieve user profile", status_code=user_profile_response.status_code)
        if game_history_response.status_code != status.HTTP_200_OK:
            raise Error("Failed to retrieve game history", status_code=game_history_response.status_code)
        return (user_profile_response.json(), game_history_response.json())


    def _validate_authorization_header(self, auth_token):

        if not auth_token or not auth_token.startswith("Bearer"):
            raise Error(message="Authorization header missing", status_code=status.HTTP_401_UNAUTHORIZED)
        token = auth_token.split(" ")
        if len(token) == 1:
            raise Error(message="missing token", status_code=status.HTTP_401_UNAUTHORIZED)
        return token[1]
        
            
    async def _validate_token(self, token):

        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.VALIDATE_TOKEN_URL,
                json={"token": token},
                headers={"Host": "localhost"}
            )
            if response.status_code != status.HTTP_200_OK:
                raise Error("Token is invalid or expired", status_code=response.status_code)
            return (response.json(), response.status_code)

profile_game_history_view = ProfileWithGameHistoryView.as_view()
