from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViews,SaleViews,sales_by_month,low_stock_alert


app_name= 'sales'

router = DefaultRouter()
router.register(r'sales', SaleViews, basename='sale')

urlpatterns = [
    path('product/',ProductViews.as_view(),name='product'),
    path('sales-month/',sales_by_month(),name='sales_by_month'),
    path('low_stock/',low_stock_alert.as_view(),name='stock'),

]+ router.urls




