from django.contrib import admin
from .models import User,Client
# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display=(
        "full_name",
        "email",
        "dni",
        "created_at",
        "is_active",
        "is_staff",
        "is_superuser",
        "last_login",
    )



@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display=(
        
        "first_name",
        "last_name",
        "email",
        "phone",
        "membership_type",
        "start_date",
        "end_date",
         "is_active",
        
        
    )