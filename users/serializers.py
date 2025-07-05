from rest_framework import serializers
from .models import User,Client

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = User
        fields = (
            'dni',
            'password',
            'full_name',
            'email',
            'gender',
            'birthdate',
            'address',
            'phone',
        )
    
    def create(self,validated_data):
        # extraemos la contraseña y las haseamos con set_password
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    





