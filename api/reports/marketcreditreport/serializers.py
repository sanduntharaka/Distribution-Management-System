from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice


class InvoiceSerializer(serializers.ModelSerializer):
    dealer = serializers.CharField(source='dealer.name')
    address = serializers.CharField(source='dealer.address')
    invoice_number = serializers.CharField(
        source='get_bill_code_number_combine')
    balance = serializers.CharField(source='get_balance')

    class Meta:
        model = SalesRefInvoice
        fields = ('confirmed_date', 'dealer', 'address',
                  'invoice_number', 'total', 'paid_amount', 'balance')
