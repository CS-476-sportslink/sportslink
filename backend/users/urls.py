from django.urls import path
from users.views import RegisterView, MeView, LogoutView, UpdateMeView, ChangePasswordView, UserProfileView,ForgotPasswordView, ResetPasswordView

# https://docs.djangoproject.com/en/6.0/topics/http/urls/

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('me/update/', UpdateMeView.as_view(), name='update-me'),
    path('logout/', LogoutView.as_view(), name = 'logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/<uuid:pk>/', UserProfileView.as_view(), name='user-profile'),

    path('forgot-password/', ForgotPasswordView.as_view(),name="forgot-password"),
    path('reset-password/',ResetPasswordView.as_view(), name="password-reset"),




]


