from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .serializer import PlayerSerializer, PlayerRankSerializer
from game.models import Player
# Create your views here.

class PlayerDetailView( generics.RetrieveAPIView ):
    lookup_field = 'username'
    queryset = Player.objects.all(  )
    serializer_class = PlayerSerializer

    def retrieve( self, request, *args, **kwargs ):
        username = kwargs.get( 'username' )
        if not username:
            return Response( data={'detail': 'no username was provided'}, status=404)
        Player.objects.get_or_create( username=username )
        return super().retrieve(request, *args, **kwargs)

class leaderBoardView( generics.ListAPIView ):
    serializer_class =  PlayerRankSerializer
    queryset = Player.objects.order_by( "-points" )

