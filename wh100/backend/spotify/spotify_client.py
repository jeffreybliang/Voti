import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from rest_framework.decorators import api_view
from django.conf import settings
from collections import Counter

CLIENT_ID = settings.SPOTIFY_CLIENT_ID
CLIENT_SECRET = settings.SPOTIFY_CLIENT_SECRET
REDIRECT_URI = "http://127.0.0.1:8000/spotify/callback/" # TODO: change this!!!!
START_DATE=settings.START_DATE
END_DATE=settings.END_DATE
SCOPE = "playlist-modify-public"

def valid_release_date(release_date:str, start=START_DATE, end=END_DATE):
    return start<=release_date<=end

class SpotifyClient:
    def __init__(self):
        self.cache_handler = spotipy.cache_handler.CacheFileHandler()
        self.client_credentials_manager = SpotifyClientCredentials(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            cache_handler=self.cache_handler
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

def get_artist_ids(artists):
    ids = [a['id'] for a in artists]
    return ids

def get_artist_names(artists):
    names = [a['name'] for a in artists]
    return names

def get_largest_image_url(image_urls):
    if image_urls:
        return image_urls[0]['url']
    return ""

class SpotifySong:
    def __init__(self, track) -> None:
        self.song_id = track['id']
        self.name = track['name']
        self.artist_ids = get_artist_ids(track['artists'])
        self.artist_names = get_artist_names(track['artists'])
        self.release_date = track['album']['release_date']
        self.image_url = get_largest_image_url(track['album']['images'])

    def __eq__(self, other: object) -> bool:
        if self is other:
            return True
        elif self.name == other.name and Counter(self.artist_ids) == Counter(other.artist_ids):
            return True
        else:
            return False
        
    def __str__(self):
        return f'{self.song_id}, {self.name}, {self.artist_ids}, {self.release_date}'
    
    def __repr__(self) -> str:
        return f'{self.song_id}, {self.name}, {self.artist_ids}, {self.release_date}'
    
    def __hash__(self):
        return hash((self.name, tuple(self.artist_ids)))
    


class SpotifyOAuthClient:
    def __init__(self, redirect_uri=REDIRECT_URI):
        self.cache_handler = spotipy.cache_handler.CacheFileHandler()
        self.oauth_manager = SpotifyOAuth(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            redirect_uri=redirect_uri,
            scope=SCOPE,
            cache_handler=self.cache_handler
        )
        self.sp = None
    
    def get_oauth(self):
        return self.oauth_manager

    def get_cache_handler(self):
        return self.cache_handler

    def get_authorization_url(self):
        return self.oauth_manager.get_authorize_url()

    def get_access_token(self, code):
        return self.oauth_manager.get_access_token(code)

    def get_client(self):
        if not self.sp:
            self.sp = spotipy.Spotify(auth_manager=self.oauth_manager)
        return self.sp
