from rest_framework import serializers


def adjust_stock_for_sale(product, quantity):
    """
    Resta `quantity` de product.stock, 
    o lanza ValidationError si no hay suficiente.
    """
    if product.stock < quantity:
        raise serializers.ValidationError(
            f"No hay suficiente stock de {product.name} "
            f"(tenemos {product.stock}, pediste {quantity})"
        )
    product.stock -= quantity
    product.save(update_fields=['stock'])