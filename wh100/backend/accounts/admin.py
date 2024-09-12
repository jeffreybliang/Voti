from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import password_validation
from django import forms

class UserRegistrationForm(UserCreationForm):
    password2 = None  # Remove the second password field

    class Meta:
        model = User
        fields = ('username', 'password1')  # Exclude email

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        try:
            password_validation.validate_password(password1, self.instance)
        except forms.ValidationError as error:
            self.add_error('password1', error)  # Add error to the form
        return password1


class UserAdmin(BaseUserAdmin):
    form = BaseUserAdmin.form  # Keep the existing form for editing
    add_form = UserRegistrationForm  # Use the custom form for adding new users

    list_display = ('username', 'email', 'is_staff', 'is_active', 'is_superuser')
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    search_fields = ('username', 'email')
    ordering = ('username',)

    fieldsets = (
        (None, {'fields': ('username', 'password1')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions', 'groups')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1'),
        }),
    )

admin.site.register(User, UserAdmin)

