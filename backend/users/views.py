from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from users.serializers import RegisterSerializer
from users.models import User

# https://www.django-rest-framework.org/api-guide/generic-views/#createapiview
# https://www.django-rest-framework.org/api-guide/permissions/#allowany

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer