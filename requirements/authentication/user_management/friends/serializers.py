from rest_framework import serializers
from Profiles.serializers import UserProfileSerializer
from friendship.models import FriendshipRequest

class FriendshipRequestSerializer(serializers.ModelSerializer):
    
    from_user = UserProfileSerializer(source='from_user.profile', read_only=True)

    class Meta:
        model = FriendshipRequest
        fields = [
            "id",
            "from_user"
        ]