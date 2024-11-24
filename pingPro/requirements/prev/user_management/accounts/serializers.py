from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model
from Profiles.models import Profile

User = get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ("username", "password")
    
    def create(self, validated_data):
        user =  super().create(validated_data)
        Profile.objects.create(user=user)
        return user
        