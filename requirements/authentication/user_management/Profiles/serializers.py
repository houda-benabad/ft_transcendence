from rest_framework import serializers
from .models import Profile#, Friendship
from django.core.validators import validate_image_file_extension
from friendship.models import Friend
from friends.serializers import FriendshipRequestSerializer

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


class DetailedUserProfileSerializer(serializers.Serializer):
    
    user_details = UserProfileSerializer(source='*', read_only=True)
    friends = serializers.SerializerMethodField(read_only=True)
    requests = serializers.SerializerMethodField(read_only=True)
    
    def get_friends(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        return UserProfileSerializer(friends_qs, many=True, context=self.context).data
    
    def get_requests(self, obj):
        requests_qs = Friend.objects.requests(obj.user)
        return FriendshipRequestSerializer(requests_qs, many=True, context=self.context)





# class   OtherUserProfileSerializer(UserProfileSerializer):
#     is_friend = serializers.SerializerMethodField(read_only=True)

#     def get_is_friend(self, obj):
#         request = self.context.get("request")
#         return Friend.objects.are_friends(request.user, obj.user).data

# class	DetailedotherUserProfileSerializer(OtherUserProfileSerializer):
    
#     friends = serializers.SerializerMethodField(read_only=True)
    
#     class Meta(OtherUserProfileSerializer.Meta):
#         fields = OtherUserProfileSerializer.Meta.fields + [
#             'friends'
#         ]
    
#     def get_friends(self, obj):
#         friends_qs = Friend.objects.friends(obj.user)
#         return OtherUserProfileSerializer(friends_qs, many=True, context=self.context)