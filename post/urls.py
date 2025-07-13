from django.urls import path
from .views import PostViews


app_name = "post"

urlpatterns = [
    path("post-admin/",PostViews.as_view(),name = "post")
]





