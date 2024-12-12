from rest_framework import generics
from .models import Profile
from .serializers import UserProfileSerializer , DetailedUserProfileSerializer, OtherUserProfileSerializer, DetailedotherUserProfileSerializer
from rest_framework import filters, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
import re

class ProfileDetailAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = DetailedUserProfileSerializer

    def get_object(self):
        return self.request.user.profile

profile_detail_view = ProfileDetailAPIView.as_view()

class ProfileListAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer

Profile_list_view = ProfileListAPIView.as_view()


class OtherUserDetailAPIView(generics.RetrieveAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = DetailedotherUserProfileSerializer
    lookup_field = 'user__id'

other_user_profile_detail_view = OtherUserDetailAPIView.as_view()


class SearchUsersView(generics.ListAPIView):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = UserProfileSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username']
    ordering = ['user__username']
    
    def filter_queryset(self, queryset):
        
        search_query = self.request.query_params.get('search', None)
        
        if search_query:
            self.validate_query_in_username(search_query)
        
        return super().filter_queryset(queryset)
    
    def validate_query_in_username(self, query):
    
        if not re.match(r'^[\w.@+-]+$', query):
            raise ValidationError("The search query can only contain letters, numbers, and @/./+/-/_ characters.")
        
        if len(query) > 30:
            raise ValidationError("The search query cannot have more than 30 characters.")

    def handle_exception(self, exc):
    
        if isinstance(exc, ValidationError):
            return Response({"detail": exc.detail}, status=status.HTTP_400_BAD_REQUEST)
            
        return super().handle_exception(exc)


search_users_profiles_view = SearchUsersView.as_view()