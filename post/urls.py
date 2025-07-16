from django.urls import path
from .views import PostCreate,PostList,PostDetail,PostUpdate,PostDestroy


app_name = "post"

urlpatterns = [
    path("post/create/",PostCreate.as_view(),name = "post"),
    path("post/list",PostList.as_view(),name = "post-list"),
    path("post/detail/<int:pk>",PostDetail.as_view(),name = "post-detail"),
    path("post/update/<int:pk>",PostUpdate.as_view(),name = "post-update"),
    path("post/delete/<int:pk>",PostDestroy.as_view(),name = "post-destroy"),
]





