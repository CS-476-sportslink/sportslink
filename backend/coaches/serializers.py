from rest_framework import serializers
from .models import CoachProfile

#this serializer converts coach profile data between python objects and JSON data
#it allows the frontend to view and send coach profile information through the API
class CoachProfileSerializer(serializers.ModelSerializer):
# pull the first and last name from the user model
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)


    class Meta:
        model = CoachProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
