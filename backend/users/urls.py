from django.urls import path
from users.views import RegisterView

# https://docs.djangoproject.com/en/6.0/topics/http/urls/

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
]