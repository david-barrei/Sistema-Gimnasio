from rest_framework import serializers
from django.conf import settings
from .models import Product,Sale,SaleDetail


class ProductSerializers(serializers.ModelSerializer):
   
   class Meta:

        model = Product
        fields = (
            'name',
            'price',
            'stock',
        )


class SaleDetailSerializers(serializers.ModelSerializer):

    product = serializers.PrimaryKeyRelatedField(
        queryset = Product.objects.all(),

    )
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only = True
    )
    subtotal = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = SaleDetail
        fields = ['id','product','quantity','price','subtotal']


class SaleWriteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField( default= serializers.CurrentUserDefault())
    items = SaleDetailSerializers(many=True)
    details = SaleDetailSerializers(many=True, source= 'items', read_only=True)
    print(f"------ {items}")

    class Meta:
        model = Sale
        fields = ['id','user','date','total','items', 'details']
        read_only_fields = ['id','date','total','details']

    def create(self,validated_data):
        print("🔔 [Serializer] validated_data before pop:")
        items_data = validated_data.pop('items')
        print("🔔 [Serializer] items to create:", + items_data)
        sale = Sale.objects.create(**validated_data)
        print(f"🆕 Venta creada con ID={sale.pk}")

        for idx, line in items_data:
            print(f"   ➡️ Creando línea #{idx} con:", line)
            SaleDetail.objects.create(sale=sale, **line)
        
        sale.recalculate_total()
        return sale


class SaleReadSerializer(serializers.ModelSerializer):
    details = SaleDetailSerializers(many=True, source='items')
    class Meta:
        model = Sale
        fields = ['id','user','date','total','details']
        read_only_fields = fields







