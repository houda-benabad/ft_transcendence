from rest_framework import generics
from .serializers import otherUserSerializer, BasicOtherUserSerializer 
from Profiles.models import Profile

class OtherUserDetailAPIView(generics.RetrieveAPIView):    #profile
    queryset = Profile.objects.all()
    serializer_class = otherUserSerializer
    lookup_field = 'user__id'

other_user_profile_detail_view = OtherUserDetailAPIView.as_view()


class BasicOtherUserDetailAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = BasicOtherUserSerializer
    lookup_field = 'user__id'

other_user_basic_profile_detail_view = BasicOtherUserDetailAPIView.as_view()

class BasicOtherUserListAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = BasicOtherUserSerializer

other_user_basic_profile_list_view = BasicOtherUserListAPIView.as_view()