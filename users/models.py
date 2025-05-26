from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


# Create your models here.

GENDER_CHOICES = (
    ('MAS','Masculino'),
    ('FEM','Femenino'),
    ('O','Otros')
)


class Membership(models.Model):
    monthly = models.IntegerField()
    tree_months = models.IntegerField()
    one_year = models.IntegerField()

class User(AbstractBaseUser,PermissionsMixin):
    dni = models.IntegerField()
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    gender = models.CharField(choices=GENDER_CHOICES)
    birhdate = models.DateField(null=True,blank=True)
    address = models.CharField()
    phone = models.CharField(max_length=255)
    is_active = models.BooleanField()
    created_at = models.DateTimeField()
    membership_id = models.ForeignKey(Membership,on_delete=models.CASCADE)

    def __str__(self):
        return self.full_name
    
class Admin(AbstractBaseUser,PermissionsMixin):
    password = models.CharField(null=False,blank=True)
    status = models.BooleanField()
    user_id = models.ForeignKey(User,on_delete=models.CASCADE)








