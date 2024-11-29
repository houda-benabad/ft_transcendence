from rest_framework import serializers
from Profiles.serializers import BasicProfileSerializer
from friendship.models import Friend, FriendshipRequest


class   BasicOtherUserSerializer(BasicProfileSerializer):
    is_friend = serializers.SerializerMethodField(read_only=True)
    
    class Meta(BasicProfileSerializer.Meta):
        fields = BasicProfileSerializer.Meta.fields + [
            'is_friend',
        ]
    
    def get_is_friend(self, obj):
        request = self.context.get("request")
        return Friend.objects.are_friends(request.user, obj.user)



class	otherUserSerializer(BasicOtherUserSerializer):
    
    friends = serializers.SerializerMethodField(read_only=True)
    
    class Meta(BasicOtherUserSerializer.Meta):
        fields = BasicOtherUserSerializer.Meta.fields + [
            'friends'
        ]
    
    def get_friends(self, obj):
        friends_qs = Friend.objects.friends(obj.user)
        return BasicOtherUserSerializer(friends_qs, many=True, context=self.context)