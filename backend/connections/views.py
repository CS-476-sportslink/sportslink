from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Connection
from .serializers import ConnectionSerializer
from users.models import User

#GET /api/connections/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_connections(request):
    status_filter = request.query_params.get('status', None)

    connections = Connection.objects.filter(
        initiator=request.user
    ) | Connection.objects.filter(
        receiver=request.user
    )

    if status_filter:
        connections = connections.filter(status=status_filter)

    connections = connections.order_by('-created_at')
    serializer = ConnectionSerializer(connections, many=True)
    return Response(serializer.data)

