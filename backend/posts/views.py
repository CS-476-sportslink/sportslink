from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from posts.models import Post, Comment
from posts.serializers import PostSerializer, CommentSerializer

# https://www.django-rest-framework.org/api-guide/generic-views/#listcreateapiview
# https://www.django-rest-framework.org/api-guide/generic-views/v
class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id:
            return Post.objects.filter(user=user_id)
        return Post.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    queryset = Post.objects.all()

class CommentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(pk=post_id)
        serializer.save(user=self.request.user, post=post)