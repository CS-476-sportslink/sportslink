#https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
#https://www.django-rest-framework.org/api-guide/fields/#write_only
#https://docs.djangoproject.com/en/6.0/topics/auth/passwords/#django.contrib.auth.password_validation.validate_password
#https://docs.djangoproject.com/en/6.0/ref/contrib/auth/#django.contrib.auth.models.UserManager.create_user
#https://docs.python.org/3/library/stdtypes.html#dict.get


from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from users.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'], 
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'first_name', 'last_name']