from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
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


# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/blacklist_app.html
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/205
# https://www.django-rest-framework.org/api-guide/views/#class-based-views
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)