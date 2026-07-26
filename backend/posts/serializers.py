from rest_framework import serializers
from posts.models import Post, Comment, SavedPost, PostLike
from users.models import User

class PostUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role']

# https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
class PostSerializer(serializers.ModelSerializer):
    user = PostUserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'body', 'media_url', 'media_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class CommentSerializer(serializers.ModelSerializer):
    user = PostUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'body', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class SavedPostSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True) #return all the post details, but dont let anything write to it.

    class Meta:
        model = SavedPost
        fields = ['id', 'post', 'created_at']
        read_only_fields = ['id', 'created_at'] #django sets these do not let anything write to them

class LikedPostSerializer(serializers.ModelSerializer): #basically the same as saved post serializer
    post = PostSerializer(read_only=True)

    class Meta:
        model = PostLike
        fields = ['id', 'post', 'created_at']
        read_only_fields = ['id', 'created_at'] #django sets these do not let anything write to them
