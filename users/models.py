from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager

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
    dni = models.IntegerField(unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=3, choices=GENDER_CHOICES, null=True, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, null=True, blank=True)

    # modelos obligatorios para los mixins 
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)  # Cambiado a True por defecto

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.full_name
    




