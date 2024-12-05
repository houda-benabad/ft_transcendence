from rest_framework import generics
from .models import Profile
from .serializers import UserProfileSerializer , DetailedUserProfileSerializer, OtherUserProfileSerializer, DetailedotherUserProfileSerializer


class ProfileDetailAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = DetailedUserProfileSerializer

    def get_object(self):
        return self.request.user.profile

profile_detail_view = ProfileDetailAPIView.as_view()

class ProfileListAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer

Profile_list_view = ProfileListAPIView.as_view()


class OtherUserDetailAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = DetailedotherUserProfileSerializer
    lookup_field = 'user__id'

other_user_profile_detail_view = OtherUserDetailAPIView.as_view()

