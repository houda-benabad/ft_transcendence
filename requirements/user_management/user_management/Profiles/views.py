from rest_framework import generics, mixins
from .models import Profile
<<<<<<< HEAD
from .serializers import \
UserProfileSerializer,ProfilePicSerializer, UserBaseProfileSerializer ,DetailedUserProfileSerializer, OtherUserProfileSerializer, DetailedotherUserProfileSerializer
from rest_framework import filters, mixins
import re

class ProfilePicUpdateAPIView(generics.UpdateAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = ProfilePicSerializer

    def get_object(self):
        return self.request.user.profile
            
profile_picture_update_view = ProfilePicUpdateAPIView.as_view()

class BaseProfileAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = UserBaseProfileSerializer

    def get_object(self):
        return self.request.user.profile
            
base_profile_view = BaseProfileAPIView.as_view()
=======
from . import serializers
from rest_framework import filters
import re


# class ProfilePicUpdateDeleteView(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
#     queryset = Profile.objects.select_related('user').all()
#     serializer_class = serializers.ProfilePicUpdateSerializer

#     def get_object(self):
#         return self.request.user.profile

# profile_pic_update_delete_view = ProfilePicUpdateDeleteView.as_view()

>>>>>>> online_status

class ProfileDetailAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = serializers.DetailedUserProfileSerializer

    def get_object(self):
        return self.request.user.profile

profile_detail_view = ProfileDetailAPIView.as_view()

class ProfileListAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.UserProfileSerializer

Profile_list_view = ProfileListAPIView.as_view()


class OtherUserDetailAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = serializers.DetailedotherUserProfileSerializer
    lookup_field = 'user__id'

other_user_profile_detail_view = OtherUserDetailAPIView.as_view()


class SearchUsersView(generics.ListAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = serializers.UserProfileSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username']
    ordering = ['user__username']
    
    def filter_queryset(self, queryset):
        
        search_query = self.request.query_params.get('search', None)
        
        if search_query:
            if not self.validate_query_in_username(search_query):
                return []
        
        return super().filter_queryset(queryset)
    
    def validate_query_in_username(self, query):
    
        if not re.match(r'^[\w.@+-]+$', query):
            return None
        
        if len(query) > 30:
            return None
        
        return query

search_users_profiles_view = SearchUsersView.as_view()