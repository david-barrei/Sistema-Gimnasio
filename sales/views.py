from django.shortcuts import render
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from .models import Product,Sale
from .serializers import ProductSerializers,SaleWriteSerializer,SaleReadSerializer

# Create your views here.
from rest_framework import viewsets
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response



class ProductViews(CreateAPIView):

    serializer_class = ProductSerializers
    queryset = Product.objects.all()

class ProductList(ListAPIView):
    serializer_class = ProductSerializers
    queryset = Product.objects.all()

class ProductDetail(RetrieveAPIView):
    lookup_field = 'pk'
    serializer_class = ProductSerializers
    queryset = Product.objects.all()

class ProductUpdate(UpdateAPIView):
    lookup_field = 'pk'
    serializer_class = ProductSerializers
    queryset = Product.objects.all()

class ProductDestroy(DestroyAPIView):
    lookup_field = 'pk'
    serializer_class = ProductSerializers
    queryset = Product.objects.all()



# class SaleViews(viewsets.ModelViewSet):
#     queryset = Sale.objects.all().order_by('-date')
    
#     def get_serializer_class(self):
#         if self.action == 'create':
#             return SaleWriteSerializer
#         return SaleReadSerializer

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


class SaleCreate(CreateAPIView):
    serializer_class = SaleWriteSerializer
    queryset = Sale.objects.all().order_by('-date')

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)


class SaleList(ListAPIView):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleReadSerializer


class SaleDetail(RetrieveAPIView):
    queryset = Sale.objects.all()
    lookup_field = 'pk'
    serializer_class = SaleReadSerializer

class SaleUpdate(UpdateAPIView):
    lookup_field = 'pk'
    serializer_class = SaleWriteSerializer
    queryset = Sale.objects.all()

    def perform_update(self, serializer):
        sale = serializer.save()
        # Recalcula total tras actualizar líneas (si cambiaste items)
        sale.recalculate_total()

class SaleDestroy(DestroyAPIView):
    lookup_field = 'pk'
    queryset = Sale.objects.all()
    




@api_view(['GET'])
def sales_by_month(request):
    qs = (
        Sale.objects.annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("total"))
        .order_by("month")
    ) # formatea como [{ "month": "2025-01", "total": 1234.50 }, …]
    data = [{"month": g["month"].strftime("%Y-%m"), "total":g["total"]} for g in qs]
    return Response(data)


@api_view(["GET"])
def low_stock_alert(request):
    threshold = int(request.query_params.get("threshold",5))
    qs = Product.objects.filter(stock__lte=threshold)
    data = [{"id": p.id, "name": p.name, "stock": p.stock} for p in qs]
    return Response(data)

