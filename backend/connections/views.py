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

#POST /api/connections/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_connection(request):
    receiver_id = request.data.get('receiver_id')

    if not receiver_id:
        return Response({'error': 'receiver_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    if str(request.user.id) == str(receiver_id):
        return Response({'error': 'You cannot connect with yourself'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        receiver = User.objects.get(pk=receiver_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if connection already exists in either direction
    existing = Connection.objects.filter(
        initiator=request.user, receiver=receiver
    ) | Connection.objects.filter(
        initiator=receiver, receiver=request.user
    )

    if existing.exists():
        return Response({'error': 'Connection already exists'}, status=status.HTTP_400_BAD_REQUEST)

    connection = Connection.objects.create(
        initiator=request.user,
        receiver=receiver,
        status=Connection.STATUS_ACCEPTED
    )

    serializer = ConnectionSerializer(connection)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


#PUT /api/connections/:id/
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def respond_to_connection(request, pk):
    try:
        connection = Connection.objects.get(pk=pk)
    except Connection.DoesNotExist:
        return Response({'error': 'Connection not found'}, status=status.HTTP_404_NOT_FOUND)

    # Only the receiver can accept or decline
    if connection.receiver != request.user:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    new_status = request.data.get('status')
    if new_status not in [Connection.STATUS_ACCEPTED, Connection.STATUS_DECLINED]:
        return Response({'error': 'Status must be accepted or declined'}, status=status.HTTP_400_BAD_REQUEST)

    connection.status = new_status
    connection.save()

    serializer = ConnectionSerializer(connection)
    return Response(serializer.data)

#DELETE /api/connections/:id/
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def withdraw_connection(request, pk):
    try:
        connection = Connection.objects.get(pk=pk)
    except Connection.DoesNotExist:
        return Response({'error': 'Connection not found'}, status=status.HTTP_404_NOT_FOUND)

    # Only the initiator can withdraw
    if connection.initiator != request.user:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    if connection.status != Connection.STATUS_PENDING:
        return Response({'error': 'Can only withdraw pending requests'}, status=status.HTTP_400_BAD_REQUEST)

    connection.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
