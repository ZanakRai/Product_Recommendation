from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Product
from django.contrib.auth.models import User


class UserRegistrationSerializer(ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['username']:
            if User.objects.filter(username=data["username"]).exists():
                raise serializers.ValidationError("Username is already exist")
            
        if data['password']!=data["confirm_password"]:
            raise serializers.ValidationError("Password must be match")

        return data
    
    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField() 

class UserSerializer(ModelSerializer):
    class Meta:
        model=User
        fields=['username','email']  

class ProductSerializer(ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'