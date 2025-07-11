from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from .selerializers import PostSerializer
from .models import PostModels
# Create your views here.


class PostViews(CreateAPIView):
    serializer_class = PostSerializer
    queryset = PostModels.objects.all()
