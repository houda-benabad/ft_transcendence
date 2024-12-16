from rest_framework import serializers
from .models import Profile#, Friendship
from django.core.validators import validate_image_file_extension
from friendship.models import Friend
from django.urls import reverse

class BaseUserProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username', read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True, validators=[validate_image_file_extension])

    class Meta:
        model = Profile
        fields = [
			'username',
			'profile_pic_url',
		]
    
    def get_profile_pic_url(self, obj):
        if obj.image_url == "":
            request = self.context.get('request')
            return request.build_absolute_uri(obj.avatar.url)
        return (obj.image_url)

class UserProfileSerializer(BaseUserProfileSerializer):
    
    profile_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta(BaseUserProfileSerializer.Meta):
        fields = BaseUserProfileSerializer.Meta.fields + ['profile_url']
    
    def get_profile_url(self, obj):
        request = self.context.get('request')
        if request.user != obj.user:
            return request.build_absolute_uri(reverse('other-user-profile-detail', kwargs={'user__id': obj.user.id}))
        return request.build_absolute_uri(reverse('current-user-profile-detail'))

from friends.serializers import FriendSerializer, FriendshipRequestSerializer

class DetailedUserProfileSerializer(serializers.Serializer):
    
    user_details = BaseUserProfileSerializer(source='*', read_only=True)
    friends = serializers.SerializerMethodField(read_only=True)
    requests = serializers.SerializerMethodField(read_only=True)
    
    def get_friends(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        friends_profiles_qs = Profile.objects.filter(user__in=friends_qs)
        return FriendSerializer(friends_profiles_qs, many=True, context=self.context).data
    
    def get_requests(self, obj):
        requests_qs = Friend.objects.requests(obj.user)
        return FriendshipRequestSerializer(requests_qs, many=True, context=self.context).data


from friends.serializers import OtherUserProfileSerializer

class	DetailedotherUserProfileSerializer(OtherUserProfileSerializer):
    
    user_details =  BaseUserProfileSerializer(source='*', read_only=True)
    friends = serializers.SerializerMethodField(read_only=True)
    
    def get_friends(self, obj):
        
        friends_qs = Friend.objects.friends(obj.user)
        friends_profiles_qs = Profile.objects.filter(user__in=friends_qs)
        return OtherUserProfileSerializer(friends_profiles_qs, many=True, context=self.context).data