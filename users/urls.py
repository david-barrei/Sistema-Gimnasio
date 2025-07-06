from django.urls import path
from .views import RegisterUser,LoginJWTView,ClientViews

from rest_framework.routers import DefaultRouter

app_name = 'users'

router = DefaultRouter()
router.register(r'register', RegisterUser, basename='register')

urlpatterns = [
    path('login/',LoginJWTView.as_view(),name='login'),
    path('client/',ClientViews.as_view(),name='client'),
] + router.urls
