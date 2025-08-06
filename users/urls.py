from django.urls import path
from .views import RegisterUser,LoginTokenView,ClientViews,ClientList,ClientDetail,ClientUpdate,ClientDestroy

from rest_framework.routers import DefaultRouter

app_name = 'users'

router = DefaultRouter()
router.register(r'register', RegisterUser, basename='register')

urlpatterns = [
    path('login/',LoginTokenView.as_view(),name='login'),
    path('client/',ClientViews.as_view(),name='client'),
    path('client/list/',ClientList.as_view(),name='client-list'),
    path('client/detail/<int:pk>/',ClientDetail.as_view(),name='client-detail'),
    path('client/update/<int:pk>/',ClientUpdate.as_view(),name='client-update'),
    path('client/destroy/<int:pk/',ClientDestroy.as_view(),name='client-destroy'),
    
  
] + router.urls

