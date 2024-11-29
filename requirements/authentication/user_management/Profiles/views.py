from rest_framework import generics
from rest_framework import permissions
from .models import Profile
from .serializers import ProfileSerializer , BasicProfileSerializer 


class ProfileDetailAPIView(generics.RetrieveAPIView):    #profile
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'user__id'

profile_detail_view = ProfileDetailAPIView.as_view()

class ProfileListAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = BasicProfileSerializer

Profile_list_view = ProfileListAPIView.as_view()
