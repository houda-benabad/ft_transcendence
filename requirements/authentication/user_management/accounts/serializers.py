from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth.models import User
from Profiles.models import Profile
from rest_framework import serializers

class UserCreateSerializer(BaseUserCreateSerializer):
    
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = [
            "username",
            "password",
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['avatar'] = serializers.ImageField(required=False, write_only=True)

    def create(self, validated_data):
        avatar = validated_data.pop('avatar', None)
        user =  super().create(validated_data)
        Profile.objects.create(user=user, avatar=avatar)
        return user
