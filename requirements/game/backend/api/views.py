from rest_framework import generics
from rest_framework.response import Response
from .serializer import PlayerSerializer, RankSerializer
from game.models import Player
import requests
from django.conf import settings
from rest_framework.views import APIView

from game.models import Player
class PlayerDetailView( generics.RetrieveAPIView ):
	lookup_field = 'userId'
	queryset = Player.objects.all(  )
	serializer_class = PlayerSerializer

	def get_object( self ):
		try: 
			host =  self.request.get_host()
			if not host:
				raise ValueError('Host not foumd')
			url_name = self.request.resolver_match.url_name
			if url_name == "PlayerInfo":
				userId = self.kwargs.get( 'userId' )
				response = requests.get( settings.USER_INFO_URL + str( userId ), headers={"Host": host})
			elif url_name == "MeInfo":
				token = self.request.headers.get( 'Authorization' )
				response = requests.get( settings.USER_INFO_URL + 'me', headers={"Host": host, 'Authorization': token })
				user_info = response.json(  )
				userId = user_info.get('id')
	
			if response.status_code != 200:
				raise ValueError( "Player not found")
					
			player = Player.objects.get( userId=userId )
			return player
		except Exception as e:
			return None

class NewPlayerView( APIView ):
	def  post(self, request, *args, **kwargs):
		try:
			userId = request.POST.get('userId')
			username = request.POST.get('username')
			new_player = Player.objects.create( userId=userId, username=username )
			new_player.save( )
			return Response( {'detail' : 'Player was created successfully'}, status=200)
		except:
			return Response( {'detail' : 'Error while creating user'}, status=505)

class UpdatePlayerView( APIView ):
	def  post(self, request, *args, **kwargs):
		try:
			userId = self.kwargs.get( 'userId' )
			username = request.POST.get('username')
			player = Player.objects.get( userId=userId )
			player.username = username
			player.save( )
			return Response( {'detail' : 'Player was updated successfully'}, status=200)
		except:
			return Response( {'detail' : 'No player with credential was found'}, status=404 )

class leaderBoardView( generics.ListAPIView ):
	queryset = Player.objects.order_by( "-total_points" )
	serializer_class =  RankSerializer