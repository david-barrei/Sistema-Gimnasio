from rest_framework import serializers
from .models import PostModels

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostModels
        fields = ["id", "picture", "offers", "article", "created_at","admin"]
        read_only_fields = ["id", "created_at","admin"]

