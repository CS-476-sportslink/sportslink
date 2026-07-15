from django.urls import path
from posts.views import PostListCreateView, PostDetailView, CommentListCreateView


# https://docs.djangoproject.com/en/6.0/topics/http/urls/
urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<uuid:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('<uuid:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create')
]