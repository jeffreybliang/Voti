from django import forms as dj_forms
from django.contrib.auth import get_user_model
from allauth.account.forms import SignupForm
from allauth.account.utils import setup_user_email
User = get_user_model()
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailAddress

class CustomSignupForm(SignupForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].widget = dj_forms.HiddenInput()


    def save(self, request):
        username = self.cleaned_data.get("username")
        self.cleaned_data['email'] = f"{username}@anu.edu.au"
        self.clean_email()
        email = self.cleaned_data.get("email")
        print("username", username, "email", email)

        if self.account_already_exists:
            raise ValueError(email)
        adapter = get_adapter()
        user = adapter.new_user(request)
        adapter.save_user(request, user, self)
        self.custom_signup(request, user)
        setup_user_email(request, user, [EmailAddress(email=email)] if email else [])
        return user

