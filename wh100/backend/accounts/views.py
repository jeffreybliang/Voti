from django.shortcuts import render, redirect
from django.views.generic.edit import FormView
from django.urls import reverse_lazy
from .forms import CustomUserForm

class CustomUserView(FormView):
    template_name = 'accounts/custom_user_form.html'
    form_class = CustomUserForm
    success_url = reverse_lazy('accounts')  # Replace with your desired redirect URL

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.username != "blah":
            return redirect(self.success_url)
        return super().dispatch(request, *args, **kwargs)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['instance'] = self.request.user  # Ensure we're updating the logged-in user
        return kwargs

    def form_valid(self, form):
        print("Form is valid, calling save method.")
        user = form.save()
        return super().form_valid(form)
