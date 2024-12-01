from rest_framework import generics
# from rest_framework import permissions
from .models import Profile
from .serializers import UserProfileSerializer , DetailedUserProfileSerializer
#, OtherUserProfileSerializer, DetailedotherUserProfileSerializer


class ProfileDetailAPIView(generics.RetrieveAPIView):    #profile
    queryset = Profile.objects.all()
    serializer_class = DetailedUserProfileSerializer

    def get_object(self):
        return self.request.user.profile

profile_detail_view = ProfileDetailAPIView.as_view()

class ProfileListAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer

Profile_list_view = ProfileListAPIView.as_view()




# class OtherUserDetailAPIView(generics.RetrieveAPIView):    #profile
#     queryset = Profile.objects.all()
#     serializer_class = DetailedotherUserProfileSerializer
#     lookup_field = 'user__id'

# other_user_profile_detail_view = OtherUserDetailAPIView.as_view()


# class BasicOtherUserDetailAPIView(generics.RetrieveAPIView):
#     queryset = Profile.objects.all()
#     serializer_class = OtherUserProfileSerializer
#     lookup_field = 'user__id'

# other_user_basic_profile_detail_view = BasicOtherUserDetailAPIView.as_view()

# class BasicOtherUserListAPIView(generics.ListAPIView):
#     queryset = Profile.objects.all()
#     serializer_class = OtherUserProfileSerializer

# other_user_basic_profile_list_view = BasicOtherUserListAPIView.as_view()
