import uuid
from django.db import models
from users.models import User

class CoachProfile(models.Model):
    SPORT_CHOICES = [
        ('football', 'Football'),
        ('hockey', 'Hockey'),
        ('basketball', 'Basketball'),
        ('soccer', 'Soccer'),
    ]

    LEVEL_CHOICES = [
        ('usports', 'USports'),
        ('bchl', 'BCHL'),
        ('ohl', 'OHL'),
        ('whl', 'WHL'),
        ('ajhl', 'AJHL'),
        ('sjhl', 'SJHL'),
        ('mjhl', 'MJHL'),
        ('cjfl', 'CJFL'),
        ('cpl', 'CPL'),
        ('njcaa', 'NJCAA'),
        ('open', 'Open'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach_profile')
    sport = models.CharField(max_length=20, choices=SPORT_CHOICES)
    school_or_team = models.CharField(max_length=200)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    contact_email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.get_full_name()}  {self.school_or_team} ({self.sport})'
