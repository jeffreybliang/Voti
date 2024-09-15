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


@api_view(['GET'])
def get_user_votes(request):
    user = request.user
    if not user.has_voted:
        return Response({'message': 'No votes found.'}, status=status.HTTP_404_NOT_FOUND)

    votes = Vote.objects.filter(username=user)
    if not votes.exists():
        return Response({'message': 'No votes found.'}, status=status.HTTP_404_NOT_FOUND)

    # Extract song IDs from votes
    song_ids = votes.values_list('song_id', flat=True)
    songs = Song.objects.filter(song_id__in=song_ids)

    # Initialize Spotify client
    sp_client = SpotifyClient().get_client()
    if not isinstance(sp_client, spotipy.Spotify):
        return Response({'Bad Request': "Couldn't get Spotify client"}, status=status.HTTP_400_BAD_REQUEST)

    # Convert Song objects to SpotifySong objects
    spotify_songs = []
    for vote in votes:
        song = songs.get(song_id=vote.song_id)
        track = sp_client.track(song.song_id)
        spotify_song = SpotifySong(track)
        spotify_songs.append(spotify_song)  # Append SpotifySong instance

    # Serialize the data
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
        new_song_ids.add(spotify_song.song_id)
        # Check if the song is already in the database
        song, _ = Song.objects.get_or_create(
            song_id=spotify_song.song_id,
            defaults={
                'name': spotify_song.name,
                'artists': spotify_song.artist_ids,
                'release': spotify_song.release_date,
                'img_url': spotify_song.img_url,
            }
        )
        if spotify_song.song_id not in current_votes:
            new_votes.append(Vote(username=user, song=song))
    if new_votes:
        Vote.objects.bulk_create(new_votes)
    # Remove songs that the user has unselected
    removed_votes = current_votes - new_song_ids
    if removed_votes:
        Vote.objects.filter(username=user.username, song_id__in=removed_votes).delete()
    if user.has_voted == False:
        user.has_voted = True
        user.save()
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
