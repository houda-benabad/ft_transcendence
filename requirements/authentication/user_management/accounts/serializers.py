from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
# from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth.models import User
from Profiles.models import Profile
from rest_framework import serializers

class UserCreateSerializer(BaseUserCreateSerializer):

    avatar = serializers.ImageField(required=False, write_only=True)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = [
            "username",
            "password",
            'avatar'
        ]

    def create(self, validated_data):
        avatar = validated_data.pop('avatar', None)
        user =  super().create(validated_data)
        if avatar is None:
            Profile.objects.create(user=user)
        else:
            Profile.objects.create(user=user, avatar=avatar)
        return user

