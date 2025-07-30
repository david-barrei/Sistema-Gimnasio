from django.conf import settings
from decimal import Decimal
from django.db import models
from users.models import User
from django.utils import timezone

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
        return f"{self.user}"
    

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
        return f"{ self.sale}"
    
    def save(self, *args, **kwargs):
        #tomamos el precio actual del producto
        self.price = self.product.price
        #calculamos 
        self.subtotal = (self.price or Decimal('0.00')) * self.quantity
        super().save(*args, **kwargs)
        
        self.sale.recalculate_total()


class CashSession(models.Model):
    opened_at = models.DateTimeField(auto_now_add=True)
    opened_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    opening_balance = models.DecimalField(max_digits=10, decimal_places=2)
    closed_at = models.DateTimeField(null=True, blank=True)
    closing_balance = models.DecimalField(max_digits=10, decimal_places=2,null=True, blank=True)
    expected_balance = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    discrepancy = models.DecimalField(max_digits=10,decimal_places=2,null=True, blank=True)

    def property_expected(self):
        sales = self.transactions.filter(type='sale').aggregate(total=models.Sum('amount'))['total'] or 0
        expenses = self.transactions.filter(type='expense').aggregate(total=models.Sum('amount'))['total'] or 0
        withdraws = self.transactions.filter(type='withdraw').aggregate(total=models.Sum('amount'))['total'] or 0
        return self.opening_balance + sales - (expenses + withdraws)
    

    def close(self, counted_amount):
        # 1) Fijar el closing_balance y la fecha
        self.closing_balance = counted_amount
        print("valor de closing", self.closing_balance)
        self.closed_at = timezone.now()
        
        # 2) Calcular y guardar expected_balance
        exp = self.property_expected()
        self.expected_balance = exp

        # 3) Calcular la discrepancia
        self.discrepancy = Decimal(str(self.closing_balance )) -  Decimal(str(exp))
        print("valor de closing 2", self.closing_balance)
        self.save()
                                
    
    def __str__(self):
        #status = 'CERRADA' if self.closed_at else 'ABIERTA'
        return f" { self.id} "
    

class CashTransaction(models.Model):
    SESSION_TYPES = [
        ('sale', 'Venta'),
        ('expense', 'Gasto'),
        ('withdraw','Retiro'),
    ]

    session = models.ForeignKey(CashSession, related_name="transactions", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10,choices=SESSION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.get_type_display()} $ {self.amount} en caja {self.session.id}"
    

