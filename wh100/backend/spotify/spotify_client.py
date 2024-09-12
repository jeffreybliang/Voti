import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from rest_framework.decorators import api_view
from django.conf import settings
from collections import Counter

CLIENT_ID = settings.SPOTIFY_CLIENT_ID
CLIENT_SECRET = settings.SPOTIFY_CLIENT_SECRET
REDIRECT_URI = "/" # TODO: change this!!!!

class SpotifyClient:
    def __init__(self):
        self.client_credentials_manager = SpotifyClientCredentials(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            cache_handler=spotipy.cache_handler.CacheFileHandler()
        )
        self.sp = spotipy.Spotify(auth_manager=self.client_credentials_manager)
    
    def get_client(self):
        return self.sp
    
    def search_unique(query: str, limit=10):
        sp_client = SpotifyClient()
        search_results = sp_client.search(q=query + " year:2023-2024", limit=limit, type="track")['tracks']['items']
        
        unique_tracks = []
        for track in search_results:
            if valid_release_date(track['album']['release_date']):
                song = SpotifySong(track)
                # if (ssong not in unique_tracks):
                #     print("name", ssong.name,
                #     "artists", ssong.artists_ids,
                #     "id", ssong.song_id,
                #     "release",ssong.release_date,
                #     "iamges", ssong.image_url)
                unique_tracks.append(song)
        return unique_tracks


class UserSpotifyClient:
    def __init__(self, token):
        self.user_client = spotipy.Spotify(auth=token)
    
    def get_client(self):
        return self.user_client

class SpotifyOAuthClient:
    def __init__(self):
        self.sp_oauth = SpotifyOAuth(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            redirect_uri=REDIRECT_URI,
            scope="playlist-modify-public"
        )
    
    def get_oauth(self):
        return self.sp_oauth

# spotify_client_instance = SpotifyClient()

def get_artists_ids(artists):
    ids = [a['id'] for a in artists]
    return ids

def get_largest_image_url(image_urls):
    if image_urls:
        return image_urls[0]['url']
    return ""

class SpotifySong:
    def __init__(self, track) -> None:
        self.song_id = track['id']
        self.name = track['name']
        self.artist_ids = get_artists_ids(track['artists'])
        self.release_date = track['album']['release_date']
        self.image_url = get_largest_image_url(track['album']['images'])

    def __eq__(self, other: object) -> bool:
        if self is other:
            return True
        elif self.name == other.name and Counter(self.artists_ids) == Counter(other.artists_ids):
            return True
        else:
            return False
        
    def __str__(self):
        return f'{self.song_id}, {self.name}, {self.artists_ids}, {self.release_date}'
    
    def __repr__(self) -> str:
        return f'{self.song_id}, {self.name}, {self.artists_ids}, {self.release_date}'
    
    def __hash__(self):
        return hash((self.name, tuple(self.artists_ids)))
    

START_DATE=settings.START_DATE
END_DATE=settings.END_DATE

def valid_release_date(release_date:str, start=START_DATE, end=END_DATE):
    return start<=release_date<=end
