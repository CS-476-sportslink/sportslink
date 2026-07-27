from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import User
from users.serializers import UserSerializer

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

    #gets with all the users stored
    queryset = User.objects.exclude(id=request.user.id)

    # Filter by both first and last
    if name:
        queryset = queryset.filter(
            first_name__icontains=name
        ) | User.objects.exclude(
            id=request.user.id
        ).filter(
            last_name__icontains=name
        )

    #split into athletes and coaches by role
    athletes = queryset.filter(role='athlete')
    coaches = queryset.filter(role='coach')


    return Response({
        'athletes': {
            'total': athletes.count(),
            'results': UserSerializer(athletes[:20], many=True).data
        },
        'coaches': {
            'total': coaches.count(),
            'results': UserSerializer(coaches[:20], many=True).data
        }
    })
