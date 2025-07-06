from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViews,SaleViews


app_name= 'sales'

router = DefaultRouter()
router.register(r'sales', SaleViews, basename='sale')

urlpatterns = [
    path('product/',ProductViews.as_view(),name='product'),
]+ router.urls




