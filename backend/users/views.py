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
from django.contrib.auth import update_session_auth_hash

from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator 
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode




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


class UpdateMeView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not request.user.check_password(current_password):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()


class ForgotPasswordView(APIView):
    # must be AllowAny - a logged-out user has no access token to send
    permission_classes =[AllowAny]
    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
            #safely encript the user id 
            user_id = urlsafe_base64_encode(str(user.pk).encode('utf-8'))
            #generate temporary token - crypographic function
            token = default_token_generator.make_token(user)
            #generate the following link with website domain, uid and unique temporary token 
            reset_url = f"http://127.0.0.1:5500/reset_password.html?user_id={user_id}&token={token}"

            #send email with the password reset link 
            send_mail(
                subject=f"Reset Your Password",
                message=f"You can now reset your password to access your account, Please click the link to reset your password: {reset_url}",
                from_email='sportslink.help@gmail.com',
                recipient_list=[user.email],
                fail_silently='False',

            )
            return Response({'message': 'Reset password link has been successfully sent!'}, status=status.HTTP_200_OK)
        except (User.DoesNotExist):
            user = None
            return Response({'error':'The email does not exist.'},status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes =[AllowAny]
    def post(self, request):
        uidb64 = request.data.get('user_id')
        token = request.data.get('token')
        new_pwd = request.data.get('new_pwd')

        try:
            decoded_user_id = urlsafe_base64_decode(uidb64).decode('utf-8')
            user = User.objects.get(pk=decoded_user_id)

        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error':'Inavlid Request'},status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.set_password(new_pwd)
            user.save()
            return Response({'message':'Password has been updated'},status=status.HTTP_200_OK)
        else:
            return Response({'error':'The link has expired.'},status=status.HTTP_400_BAD_REQUEST)  
          


            