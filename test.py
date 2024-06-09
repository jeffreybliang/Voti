import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

class Song:
    def __init__(self, track) -> None:
        self.name = track['name']
        self.artists_ids = get_artists_ids(track['artists'])
        self.artists_names = get_artists_names(track['artists'])
        self.song_id = track['id']
        self.release_date = track['album']['release_date']
        self.album = track['album']['name']
        self.image_urls = get_image_urls(track['album']['images'])
        self.url = track['external_urls']['spotify']

    def __eq__(self, other: object) -> bool:
        if self is other:
            return True
        elif self.name == other.name and self.artists_ids == other.artists_ids:
            return True
        else:
            return False
        
    def __str__(self):
        return f'{self.name}, {self.artists_names}, {self.release_date}, {self.url}'
    
    def __repr__(self) -> str:
        return f'{self.name}, {self.artists_names}, {self.release_date}, {self.url}, {self.image_urls}'

def get_artists_ids(artists):
    ids = [a['id'] for a in artists]
    return ids

def get_artists_names(artists):
    names = [a['name'] for a in artists]
    return names

def get_image_urls(image_urls):
    url_dict = {}
    for d in image_urls:
        dim = d['height']
        url_dict[dim] = d['url']
    return url_dict

def valid_release_date(release_date:str, start='2023-12-01', end='2024-11-30'):
    return start<=release_date<=end

def search(query: str, limit=40):
    search_results = sp.search(q=query+" year:2023-2024", limit=limit)
    search_results = search_results['tracks']['items']
    
    invalid_songs = []
    unique_tracks = []

    for track in search_results:
        song = Song(track)
        if (song not in unique_tracks and song not in invalid_songs):
            if valid_release_date(song.release_date):
                unique_tracks.append(song)
            else:
                invalid_songs.append(song)

    return unique_tracks

