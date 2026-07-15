from django.urls import path
from users.views import RegisterView, MeView, LogoutView

# https://docs.djangoproject.com/en/6.0/topics/http/urls/

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name = 'logout'),
]