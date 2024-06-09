import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

results = sp.search(q='vampire year:2023-2024', limit=20)

for idx, track in enumerate(results['tracks']['items']):
    print(idx, track['name'], track['artists'][0]['name'], track['album']['release_date'], track['external_urls']['spotify'])
