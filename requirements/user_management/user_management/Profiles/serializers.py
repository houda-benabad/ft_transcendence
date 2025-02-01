from rest_framework import serializers
from .models import Profile#, Friendship
from friendship.models import Friend
from django.core.validators import validate_image_file_extension
import logging
logging.basicConfig(level=logging.DEBUG)
import os  
from django.conf import settings
        
logger = logging.getLogger("accounts.views")

<<<<<<< HEAD
class ProfilePicSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, validators=[validate_image_file_extension])
    reset_image = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = Profile
        fields = [
            'avatar',
            'reset_image',
        ]
    
    def validate(self, data):

        reset_image = data.get('reset_image')
        avatar = data.get('avatar')
        logger.debug(f"=============>avatar {avatar}, reset image {reset_image}")
        if not reset_image ^ (avatar != None):
            raise serializers.ValidationError("You have to choose one: reset_image or upload an image.")
        return data
    
    def update(self, instance, validated_data):

        reset_image = validated_data.get('reset_image')
        avatar = validated_data.get('avatar')
        logger.debug(f"=============>avatar {avatar}, reset image {reset_image}")
        default_avatar = instance._meta.get_field('avatar').default
        if reset_image:
            if instance.avatar.name != default_avatar:
                instance.avatar.delete(save=False)
                instance.avatar = default_avatar
        else:
            if instance.avatar.name != avatar.name and instance.avatar.name != default_avatar:
                instance.avatar.delete(save=False)
                instance.avatar = avatar
        return super().update(instance, validated_data)


class UserBaseProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username', read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
			'username',
			'profile_pic_url',
            'is_oauth2'
		]
    
    def get_profile_pic_url(self, obj):
        if obj.image_url == "":
            request = self.context.get('request')
            return request.build_absolute_uri(obj.avatar.url)
        return (obj.image_url)
=======
# class ProfilePicUpdateSerializer(serializers.ModelSerializer):

#     avatar = serializers.ImageField(required=True, write_only=True)#, validators=[validate_image_file_extension])

#     class Meta:
#         model = Profile
#         fields = [
# 			'avatar',
# 		]
    
    # define an update fct where you delete the previous picture of the user so that the memory is not full with unused images
>>>>>>> online_status


class UserProfileSerializer(serializers.ModelSerializer):

    user_id = serializers.CharField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)

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