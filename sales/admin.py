from django.contrib import admin
from .models import Sale,SaleDetail,Product,CashSession,CashTransaction
# Register your models here.
@admin.register(CashTransaction)
class SaleAdmin(admin.ModelAdmin):
    list_display = (
        'session',
        "type",
        "amount",
        "description"
    )

@admin.register(CashSession)
class SaleAdmin(admin.ModelAdmin):
    list_display = (
        'opening_balance',
        "closing_balance"
    )

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
        'id',
        'name',
        "price",
        "stock"
    )