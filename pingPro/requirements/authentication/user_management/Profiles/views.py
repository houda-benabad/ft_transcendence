from django.shortcuts import render
from rest_framework import generics
from .models import Profile
from .serializers import BasicProfileSerializer, ProfileSerializer
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
# Create your views here.

class ProfileListAPIView(generics.ListAPIView):    #friends
	queryset = Profile.objects.all()
	serializer_class = BasicProfileSerializer

Profile_list_view = ProfileListAPIView.as_view()

class ProfileDetailAPIView(generics.RetrieveAPIView):    #profile
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'user__username'

profile_detail_view = ProfileDetailAPIView.as_view()
