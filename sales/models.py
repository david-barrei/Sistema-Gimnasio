from django.conf import settings
from decimal import Decimal
from django.db import models
from users.models import User

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places =2)
    stock = models.PositiveIntegerField()
    

    def __str__(self):
        return self.name

class Sale(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='sales')
    date = models.DateTimeField(auto_now=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    

    def __str__(self):
        return self.total
    

    def recalculate_total(self):

        total = sum(item.subtotal for item in self.items.all())
        Sale.objects.filter(pk=self.pk).update(total=total)
        self.total = total

     

class SaleDetail(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, editable=False)


    def __str__(self):
        return self.subtotal
    
    def save(self, *args, **kwargs):
        #tomamos el precio actual del producto
        self.price = self.product.price
        #calculamos 
        self.subtotal = (self.price or Decimal('0.00')) * self.quantity
        super().save(*args, **kwargs)
        
        self.sale.recalculate_total()


