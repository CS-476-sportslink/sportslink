import uuid
from django.db import models
from users.models import User


class AthleteProfile(models.Model):

    SPORT_CHOICES = [
        ('football', 'Football'),
        ('hockey', 'Hockey'),
        ('basketball', 'Basketball'),
        ('volleyball', 'Volleyball'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='athlete_profile')
    sport = models.CharField(max_length=20, choices=SPORT_CHOICES)
    position = models.CharField(max_length=100)
    grad_year = models.SmallIntegerField()
    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    intended_major = models.CharField(max_length=150, blank=True)
    highlight_url = models.URLField(blank=True)
    interest_level = models.JSONField(default=list)
    stats = models.JSONField(default=dict)
    profile_views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.get_full_name()} — {self.sport} ({self.position})'


class ProfileView(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    viewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='views_made')
    viewed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='views_received')
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.viewer} viewed {self.viewed}'
