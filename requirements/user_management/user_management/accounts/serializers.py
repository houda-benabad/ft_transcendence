from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from Profiles.models import Profile
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import requests
from django.conf import settings


User = get_user_model()

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
    
    def validate_username(self, value):
        
        if len(value) < 3 or len(value) > 30:
            raise ValidationError("Username must be between 3 and 30 characters.")
        
        return value


class UserSerializer(BaseUserSerializer):

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = [
            "id",
            "username",
        ]