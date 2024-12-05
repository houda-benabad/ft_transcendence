from rest_framework import serializers
from Profiles.serializers import UserProfileSerializer
from friendship.models import Friend, FriendshipRequest
from django.contrib.auth.models import User
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
