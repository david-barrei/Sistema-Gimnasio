from django.shortcuts import render
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from django.db import transaction
from rest_framework import viewsets,permissions
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Product,Sale,CashSession,CashTransaction
from .serializers import ProductSerializers,SaleWriteSerializer,SaleReadSerializer,CashSessionSerializer,CashTransactionSerializer
from .utils import adjust_stock_for_sale
# Create your views here.



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




class SaleCreate(CreateAPIView):
    serializer_class = SaleWriteSerializer
    queryset = Sale.objects.all().order_by('-date')

    def perform_create(self, serializer):
        # 1) Toma la lista de líneas de venta que vino en el JSON under "items"
        items = self.request.data.get('items',[])

        # Arrancamos una transacción atómica
        with transaction.atomic():
        # 2) Para cada línea, busca el producto y ajusta su stock
            for line in items:
                prod = Product.objects.get(pk=line['product'])
                adjust_stock_for_sale(prod, int(line['quantity']))
        # 2) Guardamos la venta (y sus líneas) — si falla, revierte los descuentos de stock.
        sale = serializer.save(user=self.request.user)

        # 4) Registramos la transacción en caja
        session = CashSession.objects.filter(closed_at__isnull=True).first()
        if not session:
            raise ValidationError("No hay ninguna caja abierta.")
        CashTransaction.objects.create(
            session=session,
            type='sale',
            amount=sale.total,
            description=f"Venta #{sale.id}"
            )


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


#         CONTROL DE CAJA /////

#   Abrir caja
class CashSessionOpenView(CreateAPIView):
    queryset = CashSession.objects.all()
    serializer_class = CashSession
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        
        # Impide abrir más de una sin cerrar

        if CashSession.objects.filter(closed_at__isnull=True).exists():
            raise ValidationError("Ya hay una caja abierta. Cierra la existente antes de abrir otra.")

        serializer.save(opened_by = self.request.user)

#  Consulta sesion activa

@api_view(['GET'])
def cash_session_active(request):
    session = CashSession.objects.filter(closed_at__isnull=True).first()
    if not session:
        return Response({"detail":"No hay caja abierta"}, status=404)
    data = CashSession(session).data 
    return Response


# Registrar trasaccion
class CashTransactionCreate(CreateAPIView):
    queryset = CashTransaction.objects.all()
    serializer_class = CashTransaction

    def perform_create(self, serializer):
        session = CashSession.objects.filter(closed_at__isnull=True).first()
        if not session:
            raise serializer.ValidationError("No hay caja abierta.")

        serializer.save(session=session)

@api_view(['POST'])
def cash_session_close(request):
    # 1) Localiza la caja abierta
    session = CashSession.objects.filter(closed_at__isnull=True).first()
    if not session:
        return Response({"Detail":"No hay caja abierta."}, status=404)
    # 2) Lee el monto contado al final
    counted = request.data.get('closing_balance')
    session.close(counted_amount=counted)
    serializer = CashSessionSerializer(session)
    return Response(serializer.data)





