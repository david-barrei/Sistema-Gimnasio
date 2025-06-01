from django.contrib import admin
from .models import User,Membership,Client
# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display=(
        
        "full_name",
        "membership_id",
        "full_name",
    )

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display=(
        
        "client",
        "membership_type",
        'is_active'
      
    )

@admin.register(Client)
class ClientpAdmin(admin.ModelAdmin):
    list_display=(
        
        "first_name",
        
    )