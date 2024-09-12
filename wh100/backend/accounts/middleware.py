from django.shortcuts import redirect
from django.urls import reverse

class EnsureUIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            print(f"User is authenticated: {request.user.username}")
            if request.user.username == "blah" and request.path != reverse('provide_uid'):
                print("Redirecting to provide_uid form")
                return redirect('provide_uid')
        return self.get_response(request)
