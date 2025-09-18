from django.urls import path, include
from .views import *

urlpatterns = [
    path('songs/', SongListView.as_view(), name='song-list'),
    path('votes/', VoteListView.as_view(), name='vote-list'),
    path('submit-votes/', submit_votes, name='submit_votes'),
    path('user-votes/', get_user_votes, name='get_user_votes'),
    path('search/', search_songs, name='search_songs'),
    path('spotify/', include('spotify.urls')),
    path('store-vote/', store_vote, name='store-vote'),
    
    # The API endpoint that the confirmation email link will hit.
    path('confirm-vote/', confirm_vote, name='confirm-vote'),
]
