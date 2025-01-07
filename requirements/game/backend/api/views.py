from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .serializer import PlayerSerializer, RankSerializer
from game.models import Player
from django.contrib.auth.models import User
import requests
from django.conf import settings
import logging
logging.basicConfig(level=logging.DEBUG)  
        
logger = logging.getLogger("accounts.views")
class PlayerDetailView( generics.RetrieveAPIView ):
    lookup_field = 'userId'
    queryset = Player.objects.all(  )
    serializer_class = PlayerSerializer

    def retrieve( self, request, *args, **kwargs ):
        # try: 
        userId = kwargs.get( 'userId' )
        # ADD IT ENV FILE
        response = requests.get( settings.USER_INFO_URL + str( userId ), headers={"Host": "localhost"})
        
        if response.status_code != 200:
            return Response({"detail":response.json()['detail']}, status=response.status_code)
        
        user_info = response.json(  )
        player, created = Player.objects.get_or_create( 
            userId=userId, 
            defaults={
                "username" : user_info.get( 'username' ),
                "userId" : userId })
        
        print ( "RESPONSE - ", super().retrieve(request, *args, **kwargs))
        return Response({"test"})
        # except Exception as e:
            # print( "ERROR : ", e)

class leaderBoardView( generics.ListAPIView ):
    queryset = Player.objects.order_by( "-total_points" )
    serializer_class =  RankSerializer