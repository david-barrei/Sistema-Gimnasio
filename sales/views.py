from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.generics import CreateAPIView
from .serializers import ProductSerializers,SaleWriteSerializer,SaleReadSerializer
from .models import Product,Sale
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response



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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_by_month(request):
    qs = (
        Sale.objects.annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("total"))
        .order_by("month")
    ) # formatea como [{ "month": "2025-01", "total": 1234.50 }, …]
    data = [{"month": g["month"].strftime("%Y-%m"), "total":g["total"]} for g in qs]
    return Response(data)