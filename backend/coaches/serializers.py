from rest_framework import serializers
from .models import CoachProfile


class CoachProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CoachProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
