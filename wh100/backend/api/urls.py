from django.urls import path
from .views import *

urlpatterns = [
    path('songs/', SongListView.as_view(), name='song-list'),
    path('votes/', VoteListView.as_view(), name='vote-list'),
]
