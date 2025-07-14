from django.urls import path
from .views import PostCreate,PostList,PostDetail,PostUpdate,PostDestroy


app_name = "post"

urlpatterns = [
    path("post-admin/",PostCreate.as_view(),name = "post"),
    path("list-post/",PostList.as_view(),name = "post-list"),
    path("detail-post/<pk>",PostDetail.as_view(),name = "post-detail"),
    path("update-post/<pk>",PostUpdate.as_view(),name = "post-detail"),
    path("delete-post/<pk>",PostDestroy.as_view(),name = "post-destroy"),
]





