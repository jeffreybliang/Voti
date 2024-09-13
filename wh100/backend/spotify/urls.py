from django.urls import path
from .views import *

urlpatterns = [
    # Redirects the user to Spotify's authorization page
    path('spotify/auth/', spotify_auth, name='spotify_auth'),
    
    # Handles Spotify's callback and exchanges the authorization code for an access token
    path('spotify/callback/', spotify_callback, name='spotify_callback'),
    
    # Any additional Spotify-related views like playlist creation
    path('spotify/create-hottest-100/', create_hottest_100, name='create_hottest_100'),
]
