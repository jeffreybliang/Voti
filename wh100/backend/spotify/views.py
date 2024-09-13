from django.shortcuts import render
from spotify_client import *
import spotipy
from django.shortcuts import redirect
from django.db.models import Count
from .models import Vote, Song
from django.utils import timezone
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAdminUser])  # Ensure only staff can access this
def spotify_auth(request):
    # Redirect user to Spotify OAuth
    sp_oauth_manager = SpotifyOAuthClient()
    auth_url = sp_oauth_manager.get_authorization_url()
    return redirect(auth_url)

@api_view(['GET'])
@permission_classes([IsAdminUser])  # Ensure only staff can access this
def spotify_callback(request):
    sp_oauth_manager = SpotifyOAuthClient()
    code = request.GET.get('code')
    
    if not code:
        return Response({'error': 'No code provided.'}, status=400)

    sp_oauth = sp_oauth_manager.get_oauth()
    token_info = sp_oauth.get_access_token(code)
    
    if token_info:
        request.session['spotify_token'] = token_info
        return redirect('create_hottest_100')  # Redirect to a success page or dashboard TODO: change this!!!
    else:
        return Response({'error': 'Error during authentication.'}, status=400)


def get_spotify_client(request):   
    token_info = request.session.get('spotify_token')

    if not token_info:
        return redirect('spotify_auth')

    sp_oauth = SpotifyOAuthClient()
    auth_manager = sp_oauth.get_oauth()

    token_info = auth_manager.validate_token(token_info)
    if not token_info:
        return redirect('spotify_auth')
    
    sp_client = spotipy.Spotify(auth_manager=auth_manager)
    return sp_client


@api_view(['GET'])
@permission_classes([IsAdminUser])  # Ensure only staff can access this
def create_hottest_100(request):
    # Check if the user has an authenticated Spotify session
    sp_client = get_spotify_client(request)
    if not isinstance(sp_client, spotipy.Spotify):
        return sp_client  # Redirect to Spotify authentication if necessary
    
    # Query to get the top 100 songs by the number of votes from verified users
    verified_votes = Vote.objects.filter(user__emailaddress__verified=True)

    top_100_songs = Song.objects.filter(vote__in=verified_votes).annotate(vote_count=Count('vote')).order_by('-vote_count')[:100]
    
    song_ids = [item['song_id'] for item in top_100_songs]

    # Get the current user's Spotify ID
    user_id = sp_client.current_user()['id']
    
    # Get the current date and time
    current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M')

    # Update playlist name with the date and time appended
    playlist_name = f"Hottest100 {current_datetime}"
    playlist = sp_client.user_playlist_create(user=user_id, name=playlist_name)
    
    # Add the top 100 songs to the new playlist
    sp_client.playlist_add_items(playlist_id=playlist['id'], items=song_ids)
    
    # Return success message
    return Response({"message": f"Playlist '{playlist_name}' created successfully with the top 100 songs!"})
