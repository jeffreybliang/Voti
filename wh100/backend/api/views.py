# Create your views here.
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from accounts.serializers import UserSerializer
from spotify.serializers import SongSerializer, VoteSerializer, SpotifySongSerializer
from spotify.models import Song, Vote
from rest_framework.decorators import api_view
from rest_framework.response import Response
from spotify.spotify_client import SpotifySong, SpotifyClient
import spotipy
from django.http import JsonResponse
from allauth.account.models import EmailAddress
from allauth.account.utils import send_email_confirmation

from django.core.cache import cache
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid

from django.template import loader



User = get_user_model()

@api_view(["POST"])
def resend_verification_email(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Avoid leaking user existence
        return Response(status=status.HTTP_200_OK)

    email_address = EmailAddress.objects.filter(user=user, email=email).first()
    if email_address and not email_address.verified:
        send_email_confirmation(request, user, email=email)

    return Response({"detail": "Verification email sent if applicable."}, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_songs(request):
    query = request.GET.get('query', '')
    
    if not query:
        return JsonResponse({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        sp_client = SpotifyClient()  # Create a new SpotifyClient instance
        search_results = sp_client.search(query)
        
        serializer = SpotifySongSerializer(search_results, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


import time

@api_view(['GET'])
def get_user_votes(request):
    user = request.user
    # Fetch votes and related songs in one query
    votes = Vote.objects.filter(username=user).select_related('song').order_by('id')
    if not votes:
        return Response({'message': 'No votes found.'}, status=status.HTTP_404_NOT_FOUND)
    # Initialize Spotify client
    sp_client = SpotifyClient().get_client()
    if not isinstance(sp_client, spotipy.Spotify):
        return Response({'Bad Request': "Couldn't get Spotify client"}, status=status.HTTP_400_BAD_REQUEST)
    # Batch fetch Spotify track data
    track_ids = [vote.song.song_id for vote in votes]
    tracks = sp_client.tracks(track_ids)['tracks']
    # Create SpotifySong objects
    spotify_songs = [SpotifySong(track) for track in tracks]
    # Serialize and return the data
    serializer = SpotifySongSerializer(spotify_songs, many=True)
    return Response({'songs': serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST', 'PUT'])
def submit_votes(request):
    user = request.user
    spotify_songs = request.data.get('songs', [])  # These are already SpotifySong instances
    # Validation: Ensure the user is submitting up to 10 songs
    if len(spotify_songs) > 10:
        return Response({'error': 'You can only select up to 10 songs.'}, status=status.HTTP_400_BAD_REQUEST)
    # Retrieve current votes for the user
    current_votes = set(Vote.objects.filter(username=user.username).values_list('song_id', flat=True))
    new_song_ids = set()
    new_votes = []
    for spotify_song in spotify_songs:
        print(spotify_song)
        new_song_ids.add(spotify_song["song_id"])
        # Check if the song is already in the database
        song, _ = Song.objects.get_or_create(
            song_id=spotify_song["song_id"],
            defaults={
                'name': spotify_song["name"],
                'artists': spotify_song["artist_ids"],
                'release': spotify_song["release_date"],
            }
        )
        if spotify_song["song_id"] not in current_votes:
            new_votes.append(Vote(username=user, song=song))
    if new_votes:
        Vote.objects.bulk_create(new_votes)
    # Remove songs that the user has unselected
    removed_votes = current_votes - new_song_ids
    if removed_votes:
        Vote.objects.filter(username=user.username, song_id__in=removed_votes).delete()
    return Response({'message': 'Votes submitted successfully to database!'}, status=status.HTTP_200_OK)    


@api_view(['POST', 'PUT'])
def store_votes(request):
    if request.method == 'POST':
        data = request.data
        uid = data.get('uid')
        votes = data.get('votes')
        
        # 1. Generate a unique token
        token = str(uuid.uuid4())
        
        # 2. Store data in cache
        cache.set(token, {'uid': uid, 'votes': votes}, timeout=86400) # 24-hour timeout

        # 3. Construct and send confirmation email
        confirm_url = f"https://woroni100.com/confirm-votes/?token={token}"        
        subject = "Confirm Your Votes!"

        html_message = loader.render_to_string(
            'account/email/confirm_votes.html',
            {'confirm_url': confirm_url}
        )

        from_email = "Woroni Hottest 100 <noreply@woroni100.com>"
        recipient_list = [f"{uid}@anu.edu.au"]

        email = EmailMessage(subject, html_message, from_email, recipient_list)
        email.content_subtype = "html"  # this makes the body HTML only
        email.send()
        
        return JsonResponse({"message": "Confirmation email sent."})
    return JsonResponse({"error": "Invalid request method"}, status=405)

def save_user_votes(user, spotify_songs):
    """
    Saves or updates a user's votes in the database.
    """
    # Validation: Ensure the user is submitting more than 1 song
    if len(spotify_songs) == 0:
        return {'error': 'You cannot select 0 songs.'}
    if len(spotify_songs) > 10:
        return {'error': 'You can only select up to 10 songs.'}

    # Retrieve current votes for the user
    current_votes = set(Vote.objects.filter(username=user).values_list('song_id', flat=True))
    new_song_ids = set()
    new_votes = []
    
    for spotify_song in spotify_songs:
        new_song_ids.add(spotify_song["song_id"])
        # Check if the song is already in the database
        song, _ = Song.objects.get_or_create(
            song_id=spotify_song["song_id"],
            defaults={
                'name': spotify_song["name"],
                'artists': spotify_song["artist_ids"],
                'release': spotify_song["release_date"],
            }
        )
        if spotify_song["song_id"] not in current_votes:
            new_votes.append(Vote(username=user, song=song))
    
    if new_votes:
        Vote.objects.bulk_create(new_votes)
    
    # Remove songs that the user has unselected
    removed_votes = current_votes - new_song_ids
    if removed_votes:
        Vote.objects.filter(username=user, song_id__in=removed_votes).delete()
    
    return {'message': 'Votes submitted successfully to database!'}


@api_view(['GET'])
def confirm_votes(request):
    token = request.GET.get('token')
    print(f"Received token: {token}")  # Debug: Check the incoming token
    
    if not token:
        print("No token provided in request.")  # Debug
        return Response({'error': 'Invalid link. Missing token.'}, status=status.HTTP_400_BAD_REQUEST)

    cached_data = cache.get(token)
    print(f"Cached data retrieved: {cached_data}")  # Debug: Check cache content

    if cached_data:
        uid = cached_data['uid']
        votes = cached_data['votes']
        print(f"UID: {uid}, Votes: {votes}")  # Debug: Check UID and votes

        # Find or create a user for this UID
        user, created = User.objects.get_or_create(username=uid, defaults={'email': f'{uid}@anu.edu.au'})
        print(f"User {'created' if created else 'retrieved'}: {user.username}")  # Debug

        # Call the refactored function
        result = save_user_votes(user, votes)
        print(f"Result from save_user_votes: {result}")  # Debug: Check result

        if 'error' in result:
            print(f"Error saving votes: {result['error']}")  # Debug
            return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
        
        cache.delete(token)
        print(f"Token {token} deleted from cache.")  # Debug

        return Response({'message': 'Your vote has been submitted successfully!'}, status=status.HTTP_200_OK)
    
    print("Token is invalid or expired.")  # Debug
    return Response({'error': 'This link has expired or is invalid.'}, status=status.HTTP_404_NOT_FOUND)

class UserListView(generics.ListAPIView):
    User = get_user_model()
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class SongListView(generics.ListAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer

class VoteListView(generics.ListAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
