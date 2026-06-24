import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    ROLE_ATHLETE = 'athlete'
    ROLE_COACH = 'coach'
    ROLE_CHOICES = [
        (ROLE_ATHLETE, 'Athlete'),
        (ROLE_COACH, 'Coach'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, null=True, blank=True)
    profile_photo = models.URLField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    province = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f'{self.email} ({self.role})'
