from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager
from django.utils import timezone
from datetime import timedelta

# Create your models here.

GENDER_CHOICES = (
    ('MAS','Masculino'),
    ('FEM','Femenino'),
    ('O','Otros')
)

MEMBERSHIP_CHOICES = (
    ('D','Diario'),
    ('M','Mensual'),
    ('T','Trimestral'),
    ('A','Anual')
)
DURATION_BY_TYPE = {
    'D':1,
    'M': 30,
    'T': 90,
    'A': 165,
}


class Client(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    membership_type = models.CharField(choices=MEMBERSHIP_CHOICES)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()


# class Membership(models.Model):
#     client = models.ForeignKey(Client, on_delete=models.CASCADE)
#     membership_type = models.CharField(choices=MEMBERSHIP_CHOICES)
#     price = models.DecimalField(max_digits=5,decimal_places=2)
#     start_date = models.DateField(default=timezone.now)
#     end_date = models.DateField()
   
    def save(self, *args,**kwargs):
        if not self.end_date:
            duration_days = DURATION_BY_TYPE.get(self.membership_type,30)
            self.end_date = self.start_date + timedelta(days = duration_days)
        super().save(*args, **kwargs)

    def is_active(self, *args, **kwargs):
        today = timezone.now().date()
        return self.start_date <= today <= self.end_date

    def __str__(self):
        return f"{self.client} - {self.get_membership_type_display()}"


class User(AbstractBaseUser,PermissionsMixin):
    dni = models.IntegerField(unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=3, choices=GENDER_CHOICES, null=True, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
 

    # modelos obligatorios para los mixins 
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)  # Cambiado a True por defecto

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.full_name
    




