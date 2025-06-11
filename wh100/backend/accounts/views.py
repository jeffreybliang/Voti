# accounts/inputs.py
from allauth.headless.account.inputs import SignupInput
from django.core.exceptions import ValidationError
from allauth.account.adapter import get_adapter

class CustomSignupInput(SignupInput):
    def clean_username(self):
        username = self.cleaned_data["username"]

        if not (len(username) == 8 and username.startswith('u') and username[1:].isdigit()):
            raise ValidationError("Username must be of format uXXXXXXX where X are digits (0-9).")

        # Run any other default username checks (e.g. blacklist, etc.)
        get_adapter().clean_username(username)
        return username

# accounts/views.py
from allauth.headless.account.views import SignupView
import logging

logger = logging.getLogger(__name__)

class CustomSignupView(SignupView):
    input_class = {"POST": CustomSignupInput}

    def post(self, request, *args, **kwargs):
        username = self.data.get("username")
        if username and not self.data.get("email"):
            self.data["email"] = f"{username}@anu.edu.au"

        return super().post(request, *args, **kwargs)
