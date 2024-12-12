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
        remove_friend_url = request.build_absolute_uri(reverse('remove-friend', kwargs={'friend_id': other_user.id}))
        return {"status": "friend", "urls": [remove_friend_url]}


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
            return self._friend_response(request, obj.user)
        return self._stranger_response(request, obj.user)
    
    def _get_friendship_request(self, user, other_user):
        
        try:
            return FriendshipRequest.objects.get(from_user__in=[user, other_user], to_user__in=[user, other_user])
        except FriendshipRequest.DoesNotExist:
            return None
    
    def _build_uri(self, request, view_name, kwargs):
        return request.build_absolute_uri(reverse(view_name, kwargs=kwargs))
    
    def _friendship_request_response(self, friendship_request, request):
        urls = []
        if friendship_request.from_user == request.user:
                urls.append(self._build_uri(request, "cancel-request", {'to_user_id': friendship_request.to_user.id}))
                return {"status": "requested", "urls": urls}
        urls.append(self._build_uri(request, "accept-request", {'from_user_id': friendship_request.from_user.id}))
        urls.append(self._build_uri(request, "reject-request", {'from_user_id': friendship_request.from_user.id}))
        return {"status": "pending", "urls": urls}
    
    def _friend_response(self, request, other_user):
        urls = [self._build_uri(request, "remove-friend", {'friend_id': other_user.id})]
        return {"status": "friend", "urls": urls}
    
    def _stranger_response(self, request, other_user):
        urls=[self._build_uri(request, "send-request", {'to_user_id': other_user.id})]
        return {"status": "stranger", "urls": urls}