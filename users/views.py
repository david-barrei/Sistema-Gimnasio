from datetime import timedelta
from django.utils import timezone 
from django.shortcuts import render
from django.contrib.auth import authenticate
# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, ClientSerializers
from .models import User,Client

class RegisterUser(viewsets.GenericViewSet,
                      viewsets.mixins.CreateModelMixin):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]



class LoginJWTView(APIView):
     
      # 1) Permitimos el acceso sin token
     permission_classes = [AllowAny]
     # 2) Desactivamos cualquier autenticación previa
     authentication_classes = []
     
     def post(self,request):
          email = request.data.get('email')
          password = request.data.get('password')

          user = authenticate(email=email,password=password)

          if user is not None and user.is_active:
               Token.objects.filter(user=user).delete()
               token = Token.objects.create(user=user)

               expired = timezone.now()  + timedelta(minutes=10)
               user.token_expired = expired
               user.save()

               return Response({'Token':token.key},status=status.HTTP_200_OK)
          else:
               return Response({'error':'Credenciales no validas '},status=status.HTTP_401_UNAUTHORIZED)

class ClientViews(CreateAPIView):
     
    serializer_class = ClientSerializers
    queryset = Client.objects.all()

class ClientDetail(RetrieveAPIView):

     serializer_class = ClientSerializers
     queryset = Client.objects.all()

class ClientList(ListAPIView):

     serializer_class = ClientSerializers
     queryset = Client.objects.all()

class ClientUpdate(UpdateAPIView):

     serializer_class = ClientSerializers
     queryset = Client.objects.all()

class ClientDestroy(DestroyAPIView):

     queryset = Client.objects.all()



