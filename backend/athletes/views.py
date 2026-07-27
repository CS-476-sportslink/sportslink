from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import AthleteProfile, ProfileView
from .serializers import AthleteProfileSerializer
from .stat_fields import STAT_FIELDS_BY_POSITION, INTEREST_LEVELS_BY_SPORT
from athletes import serializers

#The Athlete Profile was not used as much as we planned because the frontend work to setup the separation 
#between coaches and Athletes and the stats that they use got out of scope for the timeframe of out 
#V1 release

#GET /api/athletes/me/
#this function is a GET function that trys to get the profile from the json request that stores the user
# then it serializes the profile and returns the data,
#if the try doesn't work it throws an exception 404 profile not found
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
#this function is a POST function that trys to create an athlete and checks if the user has already
#created an athlete profile and if not it serializes the data into an athlete profile from the
# request sent from the frontend
# then it checks if the serializer is valid and returns the data from the serializer
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
#this function is a GET function that tries to get an athlete profile using the id from the request
#sent from the frontend.
#it checks if the profile exists and if the user viewing the profile is not the owner
#then it creates a profile view record and updates the profile view count
#then it serializes the profile data and returns it to the frontend
#if the profile does not exist it throws an exception and returns a 404 profile not found error
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
#this function is a PUT function that tries to update an existing athlete profile
#it first checks if the profile exists and if the user making the request owns the profile
#if the user is not the owner it returns a 403 unauthorized error
#then it serializes the updated data from the frontend and checks if the data is valid
#if the serializer is valid it saves the changes and returns the updated profile data
#if the profile does not exist it returns a 404 profile not found error
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
#this function is a GET function that retrieves the number of times an athlete profile has been viewed
#it checks if the profile belongs to the current user because only the profile owner can see their views
#then it gets the most recent users that have viewed the profile and returns the view information
#if the user is not the owner it returns a 403 unauthorized error
#if the profile does not exist it returns a 404 profile not found error
#This was is a feature that will be used in later versions of the app but for now was not implemented 
#in the frontend
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

#GET /api/athletes/sport-config/
#this function is a GET function that returns the available sport configuration data
#it returns the possible stat fields for each position and the interest levels available for each sport
#this information will be used by the frontend to know what options to display when creating or editing profiles in future versions
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sport_config(request):
    return Response({
        'stat_fields': STAT_FIELDS_BY_POSITION,
        'interest_levels': INTEREST_LEVELS_BY_SPORT,
    })
