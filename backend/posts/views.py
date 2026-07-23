from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from posts.models import Post, Comment, SavedPost, PostLike
from posts.serializers import PostSerializer, CommentSerializer, SavedPostSerializer, LikedPostSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# ListCreateAPIView handles GET by returning list of objects, and POST by creating anew object
# RetrieveAPIView handles GET by returning a object by ID
# APIView is for writing our own methods

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

class SavedPostView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        saved = SavedPost.objects.filter(user=request.user) # find all the saved posts from the logged in user
        serializer = SavedPostSerializer(saved, many=True) #many lets us return a list instead of one item
        return Response(serializer.data) # convert posts into json. The other views do this for us but not APIView

    def post(self, request, post_id):
        post = Post.objects.get(pk=post_id)
        SavedPost.objects.get_or_create(user=request.user, post=post)
        return Response({'message' : 'Post saved'}, status=status.HTTP_201_CREATED)

    def delete(self, request, post_id):
        SavedPost.objects.filter(user=request.user, post=post_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#

class LikedPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        liked = PostLike.objects.filter(user=request.user) # find all the saved posts from the logged in user
        serializer = LikedPostSerializer(liked, many=True) #many lets us return a list instead of one item
        return Response(serializer.data) # convert posts into json. The other views do this for us but not APIView

    def post(self, request, post_id):
        post = Post.objects.get(pk=post_id)
        PostLike.objects.get_or_create(user=request.user, post=post)
        return Response({'message' : 'Post Liked'}, status=status.HTTP_201_CREATED)