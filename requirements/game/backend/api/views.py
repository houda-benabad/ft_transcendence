from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .serializer import PlayerSerializer, PlayerRankSerializer
from game.models import Player
from django.contrib.auth.models import User
import requests

class PlayerDetailView( generics.RetrieveAPIView ):
    lookup_field = 'userId'
    queryset = Player.objects.all(  )
    serializer_class = PlayerSerializer

    def retrieve( self, request, *args, **kwargs ):
        userId = kwargs.get( 'userId' )
        response = requests.get( f'http://user_management:8000/auth/users/{userId}' )
        if response.status_code != 200:
            return Response( data={'detail': 'User not authenticated'}, status=401)
        user_info = response.json(  )
        
        user = User.objects.filter( id=userId).first(  )
        if not user:
            return Response( data={'detail': 'no userId was provided'}, status=404)
        Player.objects.get_or_create( userId=user.id, username=user_info.get( 'username' ) )
        return super().retrieve(request, *args, **kwargs)

class leaderBoardView( generics.ListAPIView ):
    queryset = Player.objects.order_by( "-total_points" )
    serializer_class =  PlayerRankSerializer

