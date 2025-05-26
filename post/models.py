from django.db import models
from users.models import User
# Create your models here.


class PostModels (models.Model):
    picture = models.ImageField( null=True, blank=True)
    offers = models.CharField()
    article = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    admind_id = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return self.offers
    
        