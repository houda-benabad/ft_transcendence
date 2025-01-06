from rest_framework import serializers
from .models import Profile#, Friendship
from django.core.validators import validate_image_file_extension
from friendship.models import Friend

class UserProfileSerializer(serializers.ModelSerializer):

    user_id = serializers.CharField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True, validators=[validate_image_file_extension])

    class Meta:
        model = Profile
        fields = [
            'user_id',
			'username',
			'profile_pic_url',
		]
    
    def get_profile_pic_url(self, obj):
        if obj.image_url == "":
            request = self.context.get('request')
            return request.build_absolute_uri(obj.avatar.url)
        return (obj.image_url)


from friends.serializers import FriendSerializer, FriendshipRequestSerializer

class DetailedUserProfileSerializer(serializers.Serializer):
    
    user_details = UserProfileSerializer(source='*', read_only=True)
    friends = serializers.SerializerMethodField(read_only=True)
    requests = serializers.SerializerMethodField(read_only=True)
    friends_count = serializers.SerializerMethodField(read_only=True)
    
    def get_friends(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        friends_profiles_qs = Profile.objects.filter(user__in=friends_qs)
        return FriendSerializer(friends_profiles_qs, many=True, context=self.context).data
    
    def get_requests(self, obj):
        requests_qs = Friend.objects.requests(obj.user)
        return FriendshipRequestSerializer(requests_qs, many=True, context=self.context).data

    def get_friends_count(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        friends_count = len(friends_qs)
        return friends_count


from friends.serializers import OtherUserProfileSerializer

class	DetailedotherUserProfileSerializer(OtherUserProfileSerializer):
    
    user_details =  UserProfileSerializer(source='*', read_only=True)
    friends = serializers.SerializerMethodField(read_only=True)
    friends_count = serializers.SerializerMethodField(read_only=True)
    
    def get_friends(self, obj):
        
        friends_qs = Friend.objects.friends(obj.user)
        friends_profiles_qs = Profile.objects.filter(user__in=friends_qs)
        return OtherUserProfileSerializer(friends_profiles_qs, many=True, context=self.context).data
    
    def get_friends_count(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        friends_count = len(friends_qs)
        return friends_count