from django.shortcuts import render
from rest_framework import generics
from .models import Profile
from .serializers import ProfileSerializer #, BasicProfileSerializer 
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

class ProfileDetailAPIView(generics.RetrieveAPIView):    #profile
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'pk'

    def get_object(self):
        if self.kwargs.get(self.lookup_field):
            return self.get_queryset().get(pk=self.kwargs[self.lookup_field])
        return self.get_queryset().get(user=self.request.user)

profile_detail_view = ProfileDetailAPIView.as_view()

# class ProfileListAPIView(generics.ListAPIView):    #friends
# 	queryset = Profile.objects.all()
# 	serializer_class = BasicProfileSerializer

# Profile_list_view = ProfileListAPIView.as_view()
