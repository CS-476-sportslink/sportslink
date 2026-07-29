import uuid
from django.db import models
from users.models import User


#this model stores all the information related to a coach profile
#it connects a coach profile to a user account and stores information about the coach's
#sport, organization, competition level, and contact information
class CoachProfile(models.Model):

    #this list contains all of the sports that a coach can select when creating a profile
    #(in version 1 it is just a text box so this is not used yet)
    SPORT_CHOICES = [
        ('football', 'Football'),
        ('hockey', 'Hockey'),
        ('basketball', 'Basketball'),
        ('soccer', 'Soccer'),
    ]

    #this list contains the different league levels that a coach can be apart of 
    #it is used to limit the available options when creating or updating a coach profile
    #(not used in v1)
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

    #this creates a unique id for each coach profile and connects the profile to a user account
    #the profile stores information about the coach's sport, team or school, level, and contact 
    #information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach_profile')
    sport = models.CharField(max_length=20, choices=SPORT_CHOICES)
    school_or_team = models.CharField(max_length=200)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    contact_email = models.EmailField(blank=True)

    #these fields store when the coach profile was created and when it was last updated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
    #this function controls how the coach profile is displayed when printed
    #it returns the coach's name, team, and sport
    def __str__(self):
        return f'{self.user.get_full_name()}  {self.school_or_team} ({self.sport})'
