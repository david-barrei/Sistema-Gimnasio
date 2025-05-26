from django.db import models
from users.models import User,Admin


# Create your models here.

class Sale(models.Model):
    date = models.DateTimeField()
    total = models.FloatField()
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)
    adm_id = models.ForeignKey(Admin,on_delete=models.CASCADE)

    def __str__(self):
        return self.total
    


class Product(models.Model):
    name = models.CharField()
    price = models.FloatField()
    stock = models.IntegerField()
    

    def __str__(self):
        return self.name
     

class SaleDetail(models.Model):
    quantity = models.IntegerField()
    subtotal = models.FloatField()
    sale_id = models.ForeignKey(Sale,on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return self.subtotal
