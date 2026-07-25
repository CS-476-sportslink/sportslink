from django.urls import path
from posts.views import PostListCreateView, PostDetailView, CommentListCreateView, SavedPostView, LikedPostView


# https://docs.djangoproject.com/en/6.0/topics/http/urls/
urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<uuid:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('<uuid:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('<uuid:post_id>/save/', SavedPostView.as_view(), name='save-post'),
    path('saved/', SavedPostView.as_view(), name='saved-posts'),
    path('<uuid:post_id>/like/', LikedPostView.as_view(), name='like-post'),
    path('liked/', LikedPostView.as_view(), name='liked-posts'),
    path('<post_id>/likes/', LikedPostView.as_view(), name='likes-on-post'),
]