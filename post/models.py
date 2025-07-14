from django.db import models
from django.conf import settings
from users.models import User
# Create your models here.


class PostModels (models.Model):
    picture = models.ImageField(upload_to="posts/", null=True, blank=True)
    offers = models.CharField(max_length=255)
    article = models.TextField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    admin= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


    def __str__(self):
        return self.offers
    
        