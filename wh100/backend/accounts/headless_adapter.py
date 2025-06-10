# accounts/headless_adapter.py

from allauth.headless.adapter import DefaultHeadlessAdapter
from allauth.account.forms import SignupForm
from django.core.exceptions import ValidationError
from django import forms
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)


class CustomSignupForm(SignupForm):
    def clean_username(self):
        username = self.cleaned_data.get('username')
        logger.debug(f"Form clean_username called with: {username}")
        if username:
            if not username.startswith('u') or not username[1:].isdigit() or len(username) != 8:
                raise forms.ValidationError(
                    "Username must be of format uXXXXXXX where X are digits (0-9)."
                )
        return username


class MyHeadlessAdapter(DefaultHeadlessAdapter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    def get_signup_form_class(self, request):
        """Return custom signup form for validation"""
        logger.debug("get_signup_form_class called")
        return CustomSignupForm
    
    def clean_username(self, username):
        """Clean username - validate format"""
        logger.debug(f"Adapter clean_username called with: {username}")
        if not username.startswith('u') or not username[1:].isdigit() or len(username) != 8:
            raise ValidationError("Username must be of format uXXXXXXX where X are digits (0-9).")
        return username

    def save_user(self, request, user, form, commit=True):
        """Save user with custom email format"""
        logger.debug(f"save_user called with user: {user}, form: {form}")
        
        # Get username from form
        username = form.cleaned_data.get('username') if form else getattr(user, 'username', None)
        
        # Validate username format one more time
        if username:
            if not username.startswith('u') or not username[1:].isdigit() or len(username) != 8:
                raise ValidationError("Username must be of format uXXXXXXX where X are digits (0-9).")
            
            user.username = username
            user.email = f"{username}@anu.edu.au"
        
        # Set password
        password = form.cleaned_data.get('password1') if form else None
        if password:
            user.set_password(password)
            
        if commit:
            user.save()
            
        return user

    def pre_signup(self, request, user):
        """Called before signup - another place to validate"""
        username = getattr(user, 'username', None)
        if username:
            if not username.startswith('u') or not username[1:].isdigit() or len(username) != 8:
                raise ValidationError("Username must be of format uXXXXXXX where X are digits (0-9).")

    def confirm_email(self, request, email_address):
        """Override if needed"""
        return super().confirm_email(request, email_address)