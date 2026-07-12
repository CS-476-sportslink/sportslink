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

