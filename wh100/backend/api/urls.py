from django.urls import path, include
from .views import *

urlpatterns = [
    path('songs/', SongListView.as_view(), name='song-list'),
    path('votes/', VoteListView.as_view(), name='vote-list'),
    path('user-votes/', get_user_votes, name='get_user_votes'),
    path('search/', search_songs, name='search_songs'),
    path('spotify/', include('spotify.urls')),
    path('store-votes/', store_votes, name='store-votes'),
    path('confirm-votes/', confirm_votes, name='confirm-votes'),
]
