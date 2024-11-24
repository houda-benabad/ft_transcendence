from rest_framework import serializers
from .models import Profile#, Friendship

class BasicProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)
    is_friend = serializers.SerializerMethodField(read_only=True)
    url_profile = serializers.HyperlinkedIdentityField(view_name='profile', lookup_field='pk', read_only=True)

    class Meta:
        model = Profile
        fields = [
			'username',
			'profile_pic_url',
			'is_friend',
			'url_add_friend',
			'url_profile'
		]
    
    def get_profile_pic_url(self, obj):
        if self.image_url == "":
            return self.avatar.url
        return self.image_url
    
    def get_is_friend(self, obj):
        request = self.context.get("request")
        if request.user != obj.user : 
            friend = obj.user.Friendships.filter(friend=obj.user)
            if friend.exists():
                return True
        return False
                

# class FriendsSerializer(serializers.ModelSerializer):

# 	friend_info = serializers.SerializerMethodField(read_only=True)
 
# 	class Meta:
# 		model = Friendship
# 		fields = [
# 			'friend_info'
# 		]
    
# 	def get_friend_info(self, obj):
# 		profile = self.friend.profile
# 		return BasicProfileSerializer(profile, many=False, context=self.context)
        

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)
    # friends = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
			'username',
			'profile_pic_url',
			# 'friends'
		]
    
    # def get_username(self, obj):
    #     return obj.user.username
    
    def get_profile_pic_url(self, obj):
        if obj.image_url == "":
            return obj.avatar.url
        return obj.image_url
    
    # def get_friends(self, obj):
    #     friends_qs = self.user.Friendships.all()
    #     return FriendsSerializer(friends_qs, many=True, context=self.context)
    
