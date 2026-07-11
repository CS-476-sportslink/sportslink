from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from users.serializers import RegisterSerializer, UserSerializer
from users.models import User
from rest_framework.permissions import IsAuthenticated

# https://www.django-rest-framework.org/api-guide/generic-views/#createapiview
# https://www.django-rest-framework.org/api-guide/permissions/#allowany

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class MeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user