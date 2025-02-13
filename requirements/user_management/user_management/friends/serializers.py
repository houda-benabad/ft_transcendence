from rest_framework import serializers
from Profiles.serializers import UserProfileSerializer
from friendship.models import Friend, FriendshipRequest
from django.urls import reverse
from django.utils import timezone

class FriendshipRequestSerializer(serializers.ModelSerializer):
    
    from_user = UserProfileSerializer(source='from_user.profile', read_only=True)
    time_received = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FriendshipRequest
        fields = [
            "from_user",
            "time_received"
        ]

    def get_time_received(self, obj):
        now = timezone.now()
        time_passed = now - obj.created
        total_seconds = time_passed.total_seconds()
        years = int(total_seconds // (3600 * 24 * 365.25))
        if years >= 1:
            return (f"{years} year ago" if years == 1 else f"{years} years ago")
        days = time_passed.days
        months = days // 30.417
        if months >= 1:
            return (f"{months} month ago" if months == 1 else f"{months} months ago")
        if days >= 1:
            return (f"{days} day ago" if days == 1 else f"{days} days ago")
        hours = int(total_seconds // 3600)
        if hours >= 1:
            return (f"{hours} hour ago" if hours == 1 else f"{hours} hours ago")
        minutes = int(total_seconds // 60)
        if minutes >= 1:
            return (f"{minutes} min ago" if minutes == 1 else f"{minutes} mins ago")
        return (f"{int(total_seconds)} second ago" if total_seconds == 1 else f"{int(total_seconds)} seconds ago")

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
