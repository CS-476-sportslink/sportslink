from rest_framework import serializers
from .models import Connection
from users.models import User


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_photo', 'role']


class ConnectionSerializer(serializers.ModelSerializer):
    initiator = UserSummarySerializer(read_only=True)
    receiver = UserSummarySerializer(read_only=True)

    class Meta:
        model = Connection
        fields = ['id', 'initiator', 'receiver', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'initiator', 'status', 'created_at', 'updated_at']
