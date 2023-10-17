from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails, InvoiceIntem, Item


class InvoiceSerializer(serializers.ModelSerializer):
    code = serializers.CharField(source='get_bill_code_number_combine')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'date', 'total', 'code')


class InvoiceItemSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='invoice_item.bill.date')
    category = serializers.CharField(source='item.item.category.category_name')
    extended_price = serializers.FloatField(
        source='invoice_item.extended_price')

    class Meta:
        model = Item
        fields = ('id', 'qty', 'extended_price', 'date', 'category')
