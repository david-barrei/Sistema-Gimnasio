from django.contrib import admin
from.models import PostModels
# Register your models here.

@admin.register(PostModels)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'offers',
        "id"
    )
