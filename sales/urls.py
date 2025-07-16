from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViews,ProductList,ProductDetail,ProductUpdate,ProductDestroy,SaleCreate,SaleDetail,SaleList,SaleUpdate,SaleDestroy,sales_by_month,low_stock_alert


app_name= 'sales'


urlpatterns = [
    #PRODUCTOS
    path('product/create/',ProductViews.as_view(),name='product-create'),
    path('product/list/',ProductList.as_view(),name='product-list'),
    path('product/detail/<int:pk>/',ProductDetail.as_view(),name='product-detail'),
    path('product/update/<int:pk>/',ProductUpdate.as_view(),name='product-update'),
    path('product/destroy/<int:pk>/',ProductDestroy.as_view(),name='product-destroy'),
    # VENTAS
    path('sale/create/',SaleCreate.as_view(),name='sale-create'),
    path('sale/list/',SaleList.as_view(),name='sale-list'),
    path('sale/detail/<int:pk>/',SaleDetail.as_view(),name='sale-detail'),
    path('sale/update/<int:pk>/',SaleUpdate.as_view(),name='sale-update'),
    path('sale/destroy/<int:pk>/',SaleDestroy.as_view(),name='sale-destroy'),

    # ESTADISTICAS / ALERTAS
    path('sales-month/',sales_by_month,name='sales_by_month'),
    path('low_stock/',low_stock_alert,name='stock'),

]




