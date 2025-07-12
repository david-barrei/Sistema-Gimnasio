from django.urls import path
from .views import CreateAPIView


app_name = "post"

urlpatterns = [
    path("post/",CreateAPIView.as_view(),name = "post")
]





