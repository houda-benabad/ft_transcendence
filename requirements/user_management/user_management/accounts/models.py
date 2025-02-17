from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    lower_username = models.CharField(max_length=150, unique=True)