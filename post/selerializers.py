from rest_framework import serializers
from .models import PostModels

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostModels
        fields = (
            "picture",
            "offers",
            "article",
            "created_at",
           
        )


