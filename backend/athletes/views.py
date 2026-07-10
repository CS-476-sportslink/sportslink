from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import AthleteProfile, ProfileView
from .serializer import AthleteProfileSerializer
from .stat_fields import STAT_FIELDS_BY_POSITION, INTEREST_LEVELS_BY_SPORT


