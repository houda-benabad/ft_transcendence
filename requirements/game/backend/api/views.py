from rest_framework import generics
from rest_framework.response import Response
from .serializer import PlayerSerializer, RankSerializer
from game.models import Player
import requests
from django.conf import settings
from .permissions import AuthenticationUsingJWT
from rest_framework.views import APIView
import logging
from game.models import Player

logging.basicConfig(level=logging.DEBUG)  

logger = logging.getLogger("game.views") 
class MeDetailView( generics.RetrieveAPIView ):
	queryset = Player.objects.all(  )
	serializer_class = PlayerSerializer
	permission_classes = [ AuthenticationUsingJWT ]

	def get_object( self ):
		user_info = self.request.user_info
		player = Player. objects.get( userId=user_info.get('id') )
		return player

class PlayerDetailView( generics.RetrieveAPIView ):
	lookup_field = 'userId'
	queryset = Player.objects.all(  )
	serializer_class = PlayerSerializer

	def get_object( self ):
		try: 
			userId = kwargs.get( 'userId' )
			response = requests.get( settings.USER_INFO_URL + str( userId ), headers={"Host": "localhost"})
			
			if response.status_code != 200:
				return Response({"detail":response.json()['detail']}, status=response.status_code)
			
			user_info = response.json(  )
			return Player.objects.get( userId=userId )

		except Exception as e:
			Response({'detail' : 'Error ocurred during operation'})

class NewPlayerView( APIView ):
	def  post(self, request, *args, **kwargs):
		userId = request.POST.get('userId')
		username = request.POST.get('username')
		new_player = Player.objects.create( userId=userId, username=username )
		new_player.save( )
		return Response({"detail" : "player created successfully"})

# working fine
class leaderBoardView( generics.ListAPIView ):
	queryset = Player.objects.order_by( "-total_points" )
	serializer_class =  RankSerializer