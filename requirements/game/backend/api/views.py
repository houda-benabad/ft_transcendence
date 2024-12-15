from django.shortcuts import render
from rest_framework import generics
from .serializer import PlayerSerializer
from game.models import Player
# Create your views here.

class PlayerDetailView( generics.RetrieveAPIView ):
    lookup_field = 'username'
    queryset = Player.objects.all(  )
    serializer_class = PlayerSerializer

