from django.db import models
from accounts.models import User
# Create your models here.
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model

# Create your models here.
class Song(models.Model):
    song_id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    artists = ArrayField(base_field=models.CharField(max_length=50))
    release = models.DateField(auto_now=False, auto_now_add=False)
    img_url = models.URLField()
    # can add the duration

class Vote(models.Model):
    username = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    song_id = models.ForeignKey(Song, on_delete=models.CASCADE)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['username', 'song_id'], name='unique_vote')
        ]
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['song_id'])
        ]
