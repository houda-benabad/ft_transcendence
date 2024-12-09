from rest_framework import serializers
from .models import Profile#, Friendship
from django.core.validators import validate_image_file_extension
from friendship.models import Friend, FriendshipRequest
from django.urls import reverse

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


class FriendSerializer(UserProfileSerializer):
    remove_friend = serializers.HyperlinkedIdentityField(
        view_name='remove-friend',
        lookup_field='user_id',
        lookup_url_kwarg = 'friend_id'
    )
    
    class Meta(UserProfileSerializer.Meta):
        fields = UserProfileSerializer.Meta.fields + ['remove_friend']


class DetailedUserProfileSerializer(serializers.Serializer):
    
    user_details = UserProfileSerializer(source='*', read_only=True)
    friends = serializers.SerializerMethodField(read_only=True)
    requests = serializers.SerializerMethodField(read_only=True)
    
    def get_friends(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        friends_profiles_qs = Profile.objects.filter(user__in=friends_qs)
        return FriendSerializer(friends_profiles_qs, many=True, context=self.context).data
    
    def get_requests(self, obj):
        
        from friends.serializers import FriendshipRequestSerializer

        requests_qs = Friend.objects.requests(obj.user)
        return FriendshipRequestSerializer(requests_qs, many=True, context=self.context).data


class   OtherUserProfileSerializer(serializers.Serializer):
    
    user_details = UserProfileSerializer(source='*', read_only=True)
    relationship = serializers.SerializerMethodField(read_only=True)
    
    def get_relationship(self, obj):
        
        request = self.context.get("request")
        if request.user == obj.user:
            return None
        request = self.context.get("request")
        try:
            friendship_request = FriendshipRequest.objects.get(from_user__in=[request.user, obj.user], to_user__in=[request.user, obj.user])
            if friendship_request.from_user == request.user:
                status = "requested"
                cancel_request_url =  request.build_absolute_uri(reverse('cancel-request', kwargs={'to_user_id': obj.user.id}))
                return {"status": status, "urls": cancel_request_url}
            else:
                status = "pending"
                accept_request_url = request.build_absolute_uri(reverse('accept-request', kwargs={'from_user_id': obj.user.id}))
                reject_request_url = request.build_absolute_uri(reverse('reject-request', kwargs={'from_user_id': obj.user.id}))
                return {"status": status, "urls": [accept_request_url, reject_request_url]}
        except FriendshipRequest.DoesNotExist as e:
            if Friend.objects.are_friends(request.user, obj.user):
                status = "friend"
                remove_friend_url =  request.build_absolute_uri(reverse('remove-friend', kwargs={'friend_id': obj.user.id}))
                return {"status": status, "urls": remove_friend_url}
            status = "stranger"
            send_request_url =  request.build_absolute_uri(reverse('send-request', kwargs={'to_user_id': obj.user.id}))
            return {"status": status, "urls": send_request_url}
    
    # def to_representation(self, instance):  
    #     representation = super().to_representation(instance)
    #     if representation.get('relationship') is None:
    #         representation.pop('relationship', None)  
    #     return representation  
        

class	DetailedotherUserProfileSerializer(OtherUserProfileSerializer):
    
    friends = serializers.SerializerMethodField(read_only=True)
    
    def get_friends(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        friends_profiles_qs = Profile.objects.filter(user__in=friends_qs)
        return OtherUserProfileSerializer(friends_profiles_qs, many=True, context=self.context).data