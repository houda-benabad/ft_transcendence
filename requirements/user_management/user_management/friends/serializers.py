from rest_framework import serializers
from Profiles.serializers import UserProfileSerializer
from friendship.models import Friend, FriendshipRequest
from django.urls import reverse

class FriendshipRequestSerializer(serializers.ModelSerializer):
    
    from_user = UserProfileSerializer(source='from_user.profile', read_only=True)
    accept_request = serializers.SerializerMethodField(read_only=True)
    reject_request = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FriendshipRequest
        fields = [
            "id",
            "from_user",
            "accept_request",
            "reject_request"
        ]
    
    def get_accept_request(self, obj):
        request = self.context.get('request')
        accept_request_url = request.build_absolute_uri(reverse('accept-request', kwargs={'from_user_id': obj.from_user.id}))
        return accept_request_url
    
    def get_reject_request(self, obj):
        request = self.context.get('request')
        reject_request_url = request.build_absolute_uri(reverse('reject-request', kwargs={'from_user_id': obj.from_user.id}))
        return reject_request_url

class FriendSerializer(serializers.Serializer):
    
    user_details = UserProfileSerializer(source='*', read_only=True)
    relationship = serializers.SerializerMethodField(read_only=True)

    def get_relationship(self, obj):
        request = self.context.get("request")
        return self._friend_response(request, obj.user)
    
    def _friend_response(self, request, other_user):
        return {"status": "friend"}


class   OtherUserProfileSerializer(serializers.Serializer):
    
    user_details = UserProfileSerializer(source='*', read_only=True)
    relationship = serializers.SerializerMethodField(read_only=True)

    def get_relationship(self, obj):
        
        request = self.context.get("request")
        if request.user == obj.user:
            return None
        friendship_request = self._get_friendship_request(request.user, obj.user)
        if friendship_request:
            return self._friendship_request_response(friendship_request, request)
        if Friend.objects.are_friends(request.user, obj.user):
            return {"status": "friend"}
        return {"status": "stranger"}
    
    def _get_friendship_request(self, user, other_user):
        try:
            return FriendshipRequest.objects.get(from_user__in=[user, other_user], to_user__in=[user, other_user])
        except FriendshipRequest.DoesNotExist:
            return None
    
    def _friendship_request_response(self, friendship_request, request):
        if friendship_request.from_user == request.user:
            return {"status": "requested"}
        return {"status": "pending"}
