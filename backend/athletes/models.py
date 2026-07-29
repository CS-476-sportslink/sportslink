import uuid
from django.db import models
from users.models import User


#this model stores the information for an athlete's profile
#it connects to the User model and stores information about the athlete's sport,
#academic information, statistics, and profile activity
class AthleteProfile(models.Model):

    #these are the sport options that we will cover for now
    #(in the frontend we just have a textbox for now but that will be changed in future versions 
    #for more structure)
    SPORT_CHOICES = [
        ('football', 'Football'),
        ('hockey', 'Hockey'),
        ('basketball', 'Basketball'),
        ('volleyball', 'Volleyball'),
    ]
    #this creates a unique id for each athlete profile and connects the profile to a user account
    #the profile stores athlete information including their sport, position, grad year,
    #GPA, intended major, highlight videos, and sport specific stats
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='athlete_profile')
    sport = models.CharField(max_length=20, choices=SPORT_CHOICES)
    position = models.CharField(max_length=100, blank=True)
    grad_year = models.SmallIntegerField(null=True, blank=True)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    intended_major = models.CharField(max_length=150, blank=True)


    #these fields use JSON because the information changes depending on the sport
    #stats stores different statistics for each athlete and interest_level stores league
    # interest info
    highlight_url = models.URLField(blank=True)
    interest_level = models.JSONField(default=list)
    stats = models.JSONField(default=dict)

    #this stores the number of times an athlete profile has been viewed
    #the timestamps keep track of when the profile was created and last updated
    profile_views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #this function controls how the athlete profile is displayed when printed
    #it returns the athlete's name, sport, and position
    def __str__(self):
        return f'{self.user.get_full_name()} — {self.sport} ({self.position})'


#this model stores information about profile views
#it tracks which user viewed an athlete profile and when the view happened
#this information is used to show athletes who has viewed their profile
#this is not used yet in this version
class ProfileView(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    viewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='views_made')
    viewed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='views_received')
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.viewer} viewed {self.viewed}'
