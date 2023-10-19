from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, Item, InvoiceIntem


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefInvoice
        fields = ('date', 'total')


class InvoiceItemSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='invoice_item.bill.date')
    category = serializers.CharField(source='item.item.category.category_name')
    extended_price = serializers.FloatField(source='invoice_item.extended_price')
    qty = serializers.IntegerField(source='invoice_item.qty')
    
    class Meta:
        model = Item
        fields = ('id', 'qty', 'extended_price', 'date', 'category')
