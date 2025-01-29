from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='default.jpg', upload_to='avatars')
    image_url = models.URLField(blank=True)
    is_oauth2 = models.BooleanField(default=False)