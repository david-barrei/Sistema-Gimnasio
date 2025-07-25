from django.contrib.auth.models import Group, Permission
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import PostModels

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostModels
        fields = ["id", "picture", "offers", "article", "created_at","admin"]
        read_only_fields = ["id", "created_at","admin"]


# Serializadores para grupos y permisos

User = get_user_model()

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id","codename","name","content_type"]


class GroupSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(
        many = True,
        queryset =Permission.objects.all()
    )
    class Meta:
        model = Group
        fields = ["id","name","permissons"]


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        many = True,
        queryset = Group.objects.all()
    )
    class Meta:
        model = User
        fields = ["id","username","email","groups"]

