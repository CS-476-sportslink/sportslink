from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CoachProfile
from .serializers import CoachProfileSerializer

#GET /api/coaches/me/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    try:
        profile = CoachProfile.objects.get(user=request.user)
        serializer = CoachProfileSerializer(profile)
        return Response(serializer.data)
    except CoachProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

#POST /api/coaches/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    if hasattr(request.user, 'coach_profile'):
        return Response({'error': 'Profile already exists'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = CoachProfileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#GET /api/coaches/:id/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request, pk):
    try:
        profile = CoachProfile.objects.get(pk=pk)
        serializer = CoachProfileSerializer(profile)
        return Response(serializer.data)
    except CoachProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

