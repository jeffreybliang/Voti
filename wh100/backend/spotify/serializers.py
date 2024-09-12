from rest_framework import serializers
from .models import Song, Vote

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['song_id', 'name', 'artists', 'release', 'img_url']

class VoteSerializer(serializers.ModelSerializer):
    song_id = SongSerializer()

    class Meta:
        model = Vote
        fields = ['username', 'song_id']

    def create(self, validated_data):
        song_data = validated_data.pop('song_id')
        
        # Check if the song already exists, otherwise create it
        song, created = Song.objects.get_or_create(
            song_id=song_data['song_id'],
            defaults={
                'name': song_data['name'],
                'artists': song_data['artists'],
                'release': song_data['release'],
                'img_url': song_data['img_url']
            }
        )
        
        vote = Vote.objects.create(song_id=song, **validated_data)
        return vote
