from django.urls import path
from .views import (PostCreate,PostList,PostDetail,PostUpdate,PostDestroy,PermissionListApiView,GroupListCreateApi,
                    GroupDetailApi,UserListApi,UserDetailApi)


app_name = "post"

urlpatterns = [
    path("post/create/",PostCreate.as_view(),name = "post"),
    path("post/list",PostList.as_view(),name = "post-list"),
    path("post/detail/<int:pk>",PostDetail.as_view(),name = "post-detail"),
    path("post/update/<int:pk>",PostUpdate.as_view(),name = "post-update"),
    path("post/delete/<int:pk>",PostDestroy.as_view(),name = "post-destroy"),

    #numero de Post
    path("post/delete/<int:pk>",PostDestroy.as_view(),name = "post-destroy"),
    path("post/delete/<int:pk>",PostDestroy.as_view(),name = "post-destroy"),

    #permisos
    path('api/permissions/',PermissionListApiView.as_view(), name='permission'),

    # Grupos
    path('api/groups/', GroupListCreateApi.as_view(), name="group-list-create"),
    path('api/groups/<int:pk>/', GroupDetailApi.as_view(),name="group"),

    # Usuarios
    path('api/users/', UserListApi.as_view(),name="user-list"),
    path('api/users/<int:pk>', UserDetailApi.as_view(),name="user-detail"),
]





