from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .serializer import PlayerSerializer, PlayerRankSerializer
from game.models import Player
from django.contrib.auth.models import User


class PlayerDetailView( generics.RetrieveAPIView ):
    lookup_field = 'userId'
    queryset = Player.objects.all(  )
    serializer_class = PlayerSerializer

    def retrieve( self, request, *args, **kwargs ):
        userId = kwargs.get( 'userId' )
        user = User.objects.filter( id=userId).first(  )
        if not user:
            return Response( data={'detail': 'no userId was provided'}, status=404)
        Player.objects.get_or_create( userId=user.id )
        return super().retrieve(request, *args, **kwargs)

class leaderBoardView( generics.ListAPIView ):
    serializer_class =  PlayerRankSerializer
    queryset = Player.objects.order_by( "-total_points" )

