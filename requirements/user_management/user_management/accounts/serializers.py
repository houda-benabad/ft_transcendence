from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from django.contrib.auth import get_user_model
from Profiles.models import Profile
from rest_framework import serializers
import requests
from django.conf import settings
from django.core.validators import validate_image_file_extension


User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):

<<<<<<< HEAD
=======
    avatar = serializers.ImageField(required=False, write_only=True, validators=[validate_image_file_extension])

>>>>>>> online_status
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