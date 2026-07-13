from rest_framework import serializers
from posts.models import Post
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