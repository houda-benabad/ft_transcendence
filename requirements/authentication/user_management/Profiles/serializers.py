from rest_framework import serializers
from .models import Profile#, Friendship
from django.core.validators import validate_image_file_extension

class BasicProfileSerializer(serializers.ModelSerializer):

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

class ProfileSerializer(BasicProfileSerializer):
    
    class Meta(BasicProfileSerializer.Meta):
        fields = BasicProfileSerializer.Meta.fields + [
        ]

    
