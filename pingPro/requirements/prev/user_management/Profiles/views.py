from django.shortcuts import render
from rest_framework import generics
from . import Profile
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
    queryset = Profile.Objects.all()
    serializer_class = ProfileSerializer

profile_detail_view = ProfileDetailAPIView.as_view()

# User = get_user_model()
# @receiver(post_save, sender=User) 
# def create_profile(sender, instance, created, **kwargs):
#     if created:
#         try:
#             user_profile = Profile.objects.get(user=instance)
#         except Profile.DoesNotExist:
#         	Profile.objects.create(user=instance)