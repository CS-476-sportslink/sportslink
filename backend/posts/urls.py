from django.urls import path
from posts.views import PostListCreateView


# https://docs.djangoproject.com/en/6.0/topics/http/urls/
urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
]