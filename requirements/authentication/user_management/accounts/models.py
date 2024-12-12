from django.db import models

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator

from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator

class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()
    
    username = models.CharField(_("username"),
        max_length=30,
        unique=True,
        help_text=_(
            "Required. between 3 to 30 characters. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator, MinLengthValidator(3)],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    ) 