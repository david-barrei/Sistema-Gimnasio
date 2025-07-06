from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.generics import CreateAPIView
from .serializers import ProductSerializers,SaleWriteSerializer,SaleReadSerializer
from .models import Product,Sale

class ProductViews(CreateAPIView):

    serializer_class = ProductSerializers
    queryset = Product.objects.all()


class SaleViews(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return SaleWriteSerializer
        return SaleReadSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)