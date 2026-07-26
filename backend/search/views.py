from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from athletes.models import AthleteProfile
from athletes.serializers import AthleteProfileSerializer
from coaches.models import CoachProfile
from coaches.serializers import CoachProfileSerializer

# This is just a GET function that searches the database based on the parameters that are selected in the frontend
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    """
        GET /api/search/?name=john
        Search users by first or last name.
        Returns up to 20 results per page.
    """ 
    # gets the name query parameter from the URL
    name = request.query_params.get('name', None)

    #gets with all the athletes stored
    athletes = AthleteProfile.objects.all()
    coaches = CoachProfile.objects.all()

    # Filter by both first and last
    if name:
        athletes = athletes.filter(
            user__first_name__icontains=name
        ) | athletes.filter(
            user__last_name__icontains=name
        )
        coaches = coaches.filter(
            user__first_name__icontains=name
        ) | coaches.filter(
            user__last_name__icontains=name
        )

    athlete_serializer = AthleteProfileSerializer(athletes[:20], many=True)
    coach_serializer = CoachProfileSerializer(coaches[:20], many=True)

    return Response({
        'athletes': {
            'total': athletes.count(),
            'results': athlete_serializer.data
        },
        'coaches': {
            'total': coaches.count(),
            'results': coach_serializer.data
        }
    })
