from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails, InvoiceIntem


class InvoiceSerializer(serializers.ModelSerializer):
    psa = serializers.CharField(source='dealer.psa.area_name')
    psa = serializers.CharField(source='dealer.psa.area_name')
    bill = serializers.CharField(source='get_bill_code_number_combine')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'date', 'psa', 'total', 'bill')


class InvoiceItemSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='bill.date')
    category = serializers.CharField(source='item.category.category_name')

    class Meta:
        model = InvoiceIntem
        fields = ('id', 'qty', 'extended_price', 'date', 'category')
