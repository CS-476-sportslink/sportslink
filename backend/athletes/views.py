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


#GET /api/atheles/:id/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request, pk):
    try:
        profile = AthleteProfile.objects.get(pk=pk)
        # Log the profile view 
        if request.user != profile.user:
            ProfileView.objects.get_or_create(viewer=request.user, viewed=profile.user)
            AthleteProfile.objects.filter(pk=pk).update(profile_views=profile.profile_views + 1)
            serializer = AthleteProfileSerializer(profile)
            return Response(serializer.data)
    except AthleteProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

#PUT /api/athletes/:id/
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request, pk):
    try:
        profile = AthleteProfile.objects.get(pk=pk)
        if profile.user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AthleteProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except AthleteProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

#GET /api/athletes/:id/views/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_views(request, pk):
    try:
        profile = AthleteProfile.objects.get(pk=pk)
        if profile.user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        views = ProfileView.objects.filter(viewed=profile.user).order_by('-viewed_at')[:10]
        data = {
            'total_views': profile.profile_views,
            'recent_viewers': [
                {
                    'id': str(v.viewer.id),
                    'name': v.viewer.get_full_name(),
                    'viewed_at': v.viewed_at,
                }
                for v in views
            ]
        }
        return Response(data)
    except AthleteProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
