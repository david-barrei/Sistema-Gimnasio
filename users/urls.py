from django.urls import path, include
from .views import RegisterUser,LoginTokenView,ClientViews,ClientList,ClientDetail,ClientUpdate,ClientDestroy, LogoutView

from rest_framework.routers import SimpleRouter

app_name = 'users'

router = SimpleRouter()
router.register(r'register', RegisterUser, basename='register')

urlpatterns = [
    path('signup/',include(router.urls)),
    path('login/',LoginTokenView.as_view(),name='login_token'),
    path('logout/', LogoutView.as_view(), name='logout_token'),
    path('client/',ClientViews.as_view(),name='client'),
    path('client/list/',ClientList.as_view(),name='client-list'),
    path('client/detail/<int:pk>/',ClientDetail.as_view(),name='client-detail'),
    path('client/update/<int:pk>/',ClientUpdate.as_view(),name='client-update'),
    path('client/destroy/<int:pk>/',ClientDestroy.as_view(),name='client-destroy'),
    
  
] + router.urls

