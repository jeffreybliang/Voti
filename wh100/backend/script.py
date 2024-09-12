import requests

API_URL = 'http://127.0.0.1:8000/api/'  # Replace with your API base URL

def fetch_songs():
    response = requests.get(f'{API_URL}songs/')
    if response.status_code == 200:
        return response.json()
    else:
        print(f'Failed to fetch songs: {response.status_code}')
        return []

def fetch_votes():
    response = requests.get(f'{API_URL}votes/')
    if response.status_code == 200:
        return response.json()
    else:
        print(f'Failed to fetch votes: {response.status_code}')
        return []

def print_songs(songs):
    print("Songs:")
    for song in songs:
        print(f"ID: {song['song_id']}, Name: {song['name']}, Artists: {', '.join(song['artists'])}, Release Date: {song['release']}, Image URL: {song['img_url']}")

def print_votes(votes):
    print("\nVotes:")
    for vote in votes:
        print(f"User: {vote['username']}, Song ID: {vote['song_id']}")

if __name__ == '__main__':
    songs = fetch_songs()
    votes = fetch_votes()
    print_songs(songs)
    print_votes(votes)
