from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .serializer import PlayerSerializer, PlayerRankSerializer
from game.models import Player
from django.contrib.auth.models import User
import requests
import logging
logging.basicConfig(level=logging.DEBUG)  
        
logger = logging.getLogger("accounts.views")
class PlayerDetailView( generics.RetrieveAPIView ):
    lookup_field = 'userId'
    queryset = Player.objects.all(  )
    serializer_class = PlayerSerializer

    def retrieve( self, request, *args, **kwargs ):
        userId = kwargs.get( 'userId' )
        response = requests.get( f'http://user_management:8000/auth/users/{userId}', headers={"Host": "localhost"})
        
        if response.status_code != 200:
            return Response({"detail":response.json()['detail']}, status=response.status_code)
        
        user_info = response.json(  )
        Player.objects.get_or_create( userId=userId, username=user_info.get( 'username' ) )
        return super().retrieve(request, *args, **kwargs)

class leaderBoardView( generics.ListAPIView ):
    queryset = Player.objects.order_by( "-total_points" )
    serializer_class =  PlayerRankSerializer

