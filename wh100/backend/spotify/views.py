from django.shortcuts import render
from .spotify_client import *
import spotipy
from django.shortcuts import redirect
from django.db.models import Count
from .models import Vote, Song
from django.utils import timezone
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime
from rest_framework.response import Response
from collections import defaultdict
import io
import pandas as pd
from django.http import FileResponse

FRONTEND_HOME_URL = "https://woroni100.com/vote" 

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
    
    # Retrieve the 'next' URL from the session (set by spotify_auth)
    next_url_from_session = request.session.pop('oauth_next_url', None) 
    
    if token_info:
        request.session['spotify_token'] = token_info
        
        # Decide where to redirect the user's browser
        if next_url_from_session:
            # If the frontend explicitly asked for a specific redirect (e.g., to re-trigger playlist creation)
            return redirect(next_url_from_session)
        else:
            # Otherwise, redirect to your default frontend home URL
            return redirect(FRONTEND_HOME_URL) 
    else:
        return Response({'error': 'Error during authentication.'}, status=400)


def get_spotify_client(request):   
    token_info = request.session.get('spotify_token')

    if not token_info:
        # If no token, return None to indicate authentication is needed
        return None 

    sp_oauth = SpotifyOAuthClient()
    auth_manager = sp_oauth.get_oauth()

    token_info = auth_manager.validate_token(token_info)
    if not token_info:
        # If token is invalid, return None
        return None
    
    sp_client = spotipy.Spotify(auth_manager=auth_manager)
    return sp_client


@api_view(['GET'])
@permission_classes([IsAdminUser])  # Ensure only staff can access this
def create_hottest_100(request):
    # Check if the user has an authenticated Spotify session
    sp_client = get_spotify_client(request)
    if not isinstance(sp_client, spotipy.Spotify):
        # Return a 401 status to signal to the frontend that authentication is required
        return Response({'error': 'Spotify authentication required.'}, status=401)
    
    # Query to get the top 100 songs by the number of votes from verified users
    verified_votes = Vote.objects.filter(username__emailaddress__verified=True)

    top_100_songs = Song.objects.filter(vote__in=verified_votes).annotate(vote_count=Count('vote')).order_by('-vote_count')[:100]
    
    song_ids = [item.song_id for item in top_100_songs]

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

from collections import defaultdict
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAdminUser])
def create_hottest_100(request):
    sp_client = get_spotify_client(request)
    if not isinstance(sp_client, spotipy.Spotify):
        return Response({'error': 'Spotify authentication required.'}, status=401)

    # Only include verified users
    verified_votes = Vote.objects.filter(username__emailaddress__verified=True)

    # Count votes grouped by (song name, artists)
    vote_counts = (
        Song.objects
        .filter(vote__in=verified_votes)
        .values('name', 'artists')
        .annotate(vote_count=Count('vote'))
        .order_by('-vote_count')[:100]
    )

    sp_client = SpotifyClient() 

    # For each unique (name, artists), get the first Song object (to retrieve song_id)
    song_map = defaultdict(list)
    for song in Song.objects.filter(vote__in=verified_votes):
        key = (song.name, tuple(song.artists))
        song_map[key].append(song)

    song_ids = []
    for item in vote_counts:
        key = (item['name'], tuple(item['artists']))
        song_obj = song_map.get(key, [None])[0]
        if song_obj:
            song_ids.append(song_obj.song_id)

    user_id = sp_client.current_user()['id']
    current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M')
    playlist_name = f"Hottest100 {current_datetime}"

    playlist = sp_client.user_playlist_create(user=user_id, name=playlist_name)
    sp_client.playlist_add_items(playlist_id=playlist['id'], items=song_ids)

    return Response({"message": f"Playlist '{playlist_name}' created successfully with the top 100 songs!"})



def get_artist_names(sp, artist_ids):
    cache = {}
    unique_ids = list(set(artist_ids))
    BATCH_SIZE = 50
    for i in range(0, len(unique_ids), BATCH_SIZE):
        batch_ids = unique_ids[i:i + BATCH_SIZE]
        response = sp.artists(batch_ids)
        for artist in response['artists']:
            cache[artist['id']] = artist['name']
    return cache


@api_view(['GET'])
@permission_classes([IsAdminUser])
def download_hottest_100_excel(request):
    verified_votes = Vote.objects.filter(username__emailaddress__verified=True)

    # Group by (name, artists) and count votes
    vote_counts = (
        Song.objects
        .filter(vote__in=verified_votes)
        .values('name', 'artists')
        .annotate(vote_count=Count('vote'))
        .order_by('-vote_count')
    )

    # Collect all artist IDs used
    all_artist_ids = set()
    for item in vote_counts:
        all_artist_ids.update(item['artists'])  # assuming artists is a list of IDs/URIs

    # If you need to strip to plain IDs:
    artist_ids = [aid.split(":")[-1] for aid in all_artist_ids]
    sp = SpotifyClient().get_client()  # ← ensure you inject valid token
    artist_name_map = get_artist_names(sp, artist_ids)

    # Map (name, artists) → list of Song objects
    song_map = defaultdict(list)
    for song in Song.objects.filter(vote__in=verified_votes):
        key = (song.name, tuple(song.artists))
        song_map[key].append(song)

    # Build the final output
    data = []
    for rank, item in enumerate(vote_counts, start=1):
        raw_artist_ids = item['artists']
        key = (item['name'], tuple(raw_artist_ids))
        song_obj = song_map.get(key, [None])[0]
        if song_obj:
            plain_ids = [aid.split(":")[-1] for aid in raw_artist_ids]
            resolved_names = [artist_name_map.get(aid, 'Unknown') for aid in plain_ids]
            data.append({
                'Rank': rank,
                'Song ID': song_obj.song_id,
                'Name': song_obj.name,
                'Artists': ', '.join(resolved_names),
                'Votes': item['vote_count'],
            })

    df = pd.DataFrame(data)

    # Save to Excel
    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Hottest100')

    buffer.seek(0)
    filename = f"hottest_100_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return FileResponse(buffer, as_attachment=True, filename=filename)
