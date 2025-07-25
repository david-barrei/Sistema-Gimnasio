from rest_framework import serializers
from django.conf import settings
from .models import Product,Sale,SaleDetail,CashTransaction,CashSession
from pprint import pprint

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
    items = SaleDetailSerializers(many=True, write_only=True)
    details = SaleDetailSerializers(many=True, source= 'items', read_only=True)
    

    class Meta:
        model = Sale
        fields = ['id','user','date','total','items', 'details']
        read_only_fields = ['id','date','total','details']

    def create(self,validated_data):
       
        items_data = validated_data.pop('items')

        sale = Sale.objects.create(**validated_data)
        
        for  line in items_data:
            
            SaleDetail.objects.create(sale=sale, **line)
        
        sale.recalculate_total()
        return sale


class SaleReadSerializer(serializers.ModelSerializer):
    details = SaleDetailSerializers(many=True, source='items')
    class Meta:
        model = Sale
        fields = ['id','user','date','total','details']
        read_only_fields = fields




class CashTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashTransaction
        fields = ['id','timestamp','type','amount','description']



class CashSessionSerializer(serializers.ModelSerializer):
    opened_by = serializers.StringRelatedField(read_only = True)
    transactions = CashTransactionSerializer(many=True, read_only =True)
    expected_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CashSession
        fields = [
            'id','opened_at','opened_by','opening_balance',
            'closed_at','closing_balance','expected_balance','discrepancy','transactions',
        ]
        read_only_fields = ['id','opened_at','opened_by','opening_balance','closed_at',
                            'expected_balance','discrepancy','transactions']





