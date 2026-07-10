from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import AthleteProfile, ProfileView
from .serializers import AthleteProfileSerializer
from .stat_fields import STAT_FIELDS_BY_POSITION, INTEREST_LEVELS_BY_SPORT
from athletes import serializers

#GET /api/athletes/me/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    try:
        profile = AthleteProfile.objects.get(user=request.user)
        serializer = AthleteProfileSerializer(profile)
        return Response(serializer.data)
    except AthleteProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

#POST api/athletes/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    if hasattr(request.user, 'athlete_profile'):
        return Response({'error': 'Profile already exists'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = AthleteProfileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

