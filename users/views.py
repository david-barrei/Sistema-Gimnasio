from datetime import timedelta
from django.utils import timezone 
from django.shortcuts import render
from django.contrib.auth import authenticate
# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
from .models import User,Client

class RegisterUser(viewsets.GenericViewSet,
                      viewsets.mixins.CreateModelMixin):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]



class LoginJWTView(APIView):
     
     def post(self,request):
          email = request.data.get('email')
          password = request.data.get('password')

          user = authenticate(email=email,password=password)

          if user is not None and user.is_active:
               Token.objects.filter(user=user).delete()
               token = Token.objects.create(user=user)

               expired = timezone.now()  + timedelta(minutes=1)
               user.token_expired = expired
               user.save()

               return Response({'Token':token.key},status=status.HTTP_200_OK)
          else:
               return Response({'error':'Credenciales no validas '},status=status.HTTP_401_UNAUTHORIZED)

