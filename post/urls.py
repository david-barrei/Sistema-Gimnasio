from django.urls import path
from .views import PostCreate


app_name = "post"

urlpatterns = [
    path("post-admin/",PostCreate.as_view(),name = "post")
]





