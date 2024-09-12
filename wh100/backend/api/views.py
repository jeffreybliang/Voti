# Create your views here.
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from accounts.serializers import UserSerializer
from spotify.serializers import SongSerializer, VoteSerializer
from spotify.models import Song, Vote
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_user_votes(request):
    """
    Retrieve the list of votes that the user has cast.
    """
    user = request.user
    votes = Vote.objects.filter(username=user.username)
    
    if not votes.exists():
        return Response({'message': 'No votes found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create a list of dictionaries with vote details
    response_data = [
        {
            'vote_id': vote.id,
            'song_id': vote.song_id.song_id,  # Assuming you want the song_id from the Song model
        }
        for vote in votes
    ]
    
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_songs_voted_for(request):
    """
    Retrieve the list of songs that the user has voted for.
    """
    user = request.user
    votes = Vote.objects.filter(username=user.username)
    
    if not votes.exists():
        return Response({'message': 'No votes found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Extract the Song objects from the votes
    song_ids = votes.values_list('song_id', flat=True)
    songs = Song.objects.filter(song_id__in=song_ids)
    
    # Serialize the songs
    serializer = SongSerializer(songs, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


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
