from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CoachProfile
from .serializers import CoachProfileSerializer

#GET /api/coaches/me/
#this function is a GET function that tries to get the coach profile connected to the logged in user
#it finds the profile using the user from the request and serializes the profile data
#then it returns the profile information to the frontend
#if the profile does not exist it returns a 404 profile not found error
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
#this function is a POST function that creates a new coach profile
#it first checks if the logged in user already has a coach profile
#if a profile already exists it returns an error because each user can only have one profile
#then it serializes the data sent from the frontend and saves the new coach profile
#if the data is not valid it returns the serializer errors
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
#this function is a GET function that retrieves a coach profile using the profile id from the request
#it finds the coach profile and serializes the data before returning it to the frontend
#if the profile does not exist it returns a 404 profile not found error
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request, pk):
    try:
        profile = CoachProfile.objects.get(pk=pk)
        serializer = CoachProfileSerializer(profile)
        return Response(serializer.data)
    except CoachProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

#PUT /api/coaches/:id/update/
#this function is a PUT function that updates an existing coach profile
#it first checks if the profile exists and if the logged in user owns the profile
#if the user does not own the profile it returns a 403 unauthorized error
#then it serializes the updated data from the frontend and checks if the data is valid
#if the serializer is valid it saves the changes and returns the updated profile
#if the profile does not exist it returns a 404 profile not found error
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request, pk):
    try:
        profile = CoachProfile.objects.get(pk=pk)
        if profile.user != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CoachProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except CoachProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
