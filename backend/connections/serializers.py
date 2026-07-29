from rest_framework import serializers
from .models import Connection
from users.models import User



#this serializer returns a simplified version of a user
#it is used inside the connection serializer so only the important user information
#is returned instead of every field from the user model to make it easier to sort in the frontend
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_photo', 'role']

#this serializer converts connection data between python objects and JSON data
#it returns information about both users involved in the connection along with
#the connection status and timestamps
class ConnectionSerializer(serializers.ModelSerializer):
    initiator = UserSummarySerializer(read_only=True)
    receiver = UserSummarySerializer(read_only=True)

    class Meta:
        model = Connection
        fields = ['id', 'initiator', 'receiver', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'initiator', 'status', 'created_at', 'updated_at']
