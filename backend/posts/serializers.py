from rest_framework import serializers
from posts.models import Post

# https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'body', 'media_url', 'media_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']