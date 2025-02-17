from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from Profiles.models import Profile
from rest_framework import serializers
import requests
from django.conf import settings
from django.core.validators import validate_image_file_extension
from djoser.serializers import UsernameSerializer as BaseUsernameSerializer


User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = [
            "username",
            "password",
        ]

    def create(self, validated_data):
        user =  super().create(validated_data)
        Profile.objects.create(user=user)
        return user
    
    def validate_username(self, value):
        
        another_user = User.objects.filter(lower_username=value.lower()).first()
        if another_user:
            raise serializers.ValidationError("a user with that username already exists.")
        if len(value) < 3 or len(value) > 30:
            raise serializers.ValidationError("Username must be between 3 and 30 characters.")
        return value


class UserSerializer(BaseUserSerializer):

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = [
            "id",
            "username",
        ]

class UsernameSerializer(BaseUsernameSerializer):
    
    def validate(self, data):
        username = data.get('username')
        another_user = User.objects.filter(lower_username=username.lower()).first()
        if another_user and (self.instance is None or self.instance != another_user):
            raise serializers.ValidationError("a user with that username already exists.")
        if len(username) < 3 or len(username) > 30:
            raise serializers.ValidationError("Username must be between 3 and 30 characters.")
        return data