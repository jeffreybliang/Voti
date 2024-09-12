from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username',)
        labels = {'username': 'ANU uID'}

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username:
            raise forms.ValidationError("Username cannot be blank.")
        if User.objects.filter(username=username).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This uID is already in use.")
        return username

    def save(self, commit=True):
        user = super().save(commit=False)  # Use the instance passed into the form
        
        # Print statements to verify if we're working with the correct user
        print(f"Saving user: {user.pk}, Username: {user.username}, Email: {user.email}")
        
        # Ensure the username is valid and non-empty
        if not user.username:
            raise ValueError("Username cannot be blank.")
        
        # Set the email field based on the username (uID)
        user.email = f"{user.username}@anu.edu.au"
                
        if commit:
            # Ensure no conflicting data is saved (e.g., email already exists)
            if User.objects.filter(email=user.email).exclude(pk=user.pk).exists():
                raise ValueError("An account with this email already exists.")
            
            # Print before saving the user
            print(f"Saving user with ID: {user.pk} to the database.")
            
            user.save()

        # Return the updated user object
        return user
