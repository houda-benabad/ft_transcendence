from rest_framework import serializers
from Profiles.serializers import BasicProfileSerializer
from friendship.models import Friend, FriendshipRequest

class	FriendSerializer(BasicProfileSerializer):
    
    is_friend = serializers.SerializerMethodField(read_only=True)
    
    class Meta(BasicProfileSerializer.Meta):
        fields = BasicProfileSerializer.Meta.fields + [
            'is_friend'
        ]
    
    def get_is_friend(self, obj):
        request = self.context.get("request")
        return Friend.objects.are_friends(request.user, self.user.id)