from django.urls import path
from .views import RegisterUser,LoginJWTView

from rest_framework.routers import DefaultRouter

app_name = 'users'

router = DefaultRouter()
router.register(r'register', RegisterUser, basename='register')

urlpatterns = [
    path('login/',LoginJWTView.as_view(),name='login'),
] + router.urls
