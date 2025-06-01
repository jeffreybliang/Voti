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
