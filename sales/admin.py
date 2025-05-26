from django.contrib import admin
from .models import Sale,SaleDetail,Product
# Register your models here.
@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = (
        'total',
        "id"
    )

@admin.register(SaleDetail)
class SaleDetailAdmin(admin.ModelAdmin):
    list_display = (
        'product_id',
        "quantity"
    )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        "price",
        "stock"
    )