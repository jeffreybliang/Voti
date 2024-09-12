from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):

    @transaction.atomic
    def save_user(self, request, sociallogin, form=None):
        user = sociallogin.user
        # Check if the user already exists in the database
        if User.objects.filter(email=user.email).exists():
            existing_user = User.objects.get(email=user.email)
            sociallogin.user = existing_user  # Reassign sociallogin to the existing user
            return existing_user
        
        # If no existing user, set placeholders and create a new user
        user.username = 'blah'
        user.email = 'blah@gmail.com'  # This is a placeholder for debugging, change it as needed
        
        user.save()
        return user
