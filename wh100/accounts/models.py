from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        # Ensure that email is not passed in extra_fields to avoid conflict
        extra_fields.pop('email', None)  # Remove 'email' if it's in extra_fields

        if not username:
            raise ValueError('The uID field must be set')
        if not username.startswith('u') or not username[1:].isdigit() or len(username) != 8:
            raise ValueError('Username must be of format uXXXXXXX where X are digits (0-9).')

        email = f'{username}@anu.edu.au'  # Derive email from username

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)

class User(AbstractUser):
    username = models.CharField(max_length=8, unique=True,
        primary_key=True, help_text='Required. Must be of format uXXXXXXX where X are numeric.',
        validators=[AbstractUser.username_validator],
        error_messages={
            'unique': "A user with that uID already exists.",
        }
    )
    email = models.EmailField(unique=True, blank=True)

    def clean(self):
        super().clean()
        if not self.username.startswith('u') or not self.username[1:].isdigit() or len(self.username) != 8:
            raise ValidationError(_('Username must be of format uXXXXXXX where X are digits (0-9).'))

    objects = UserManager()
