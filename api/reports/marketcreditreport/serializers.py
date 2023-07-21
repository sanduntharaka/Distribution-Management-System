from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails


class InvoiceSerializer(serializers.ModelSerializer):
    dealer = serializers.CharField(source='bill.dealer.name')
    address = serializers.CharField(source='bill.dealer.address')
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')
    balance = serializers.FloatField(source='bill.get_balance')
    confirmed_date = serializers.CharField(
        source='bill.confirmed_date')
    total = serializers.FloatField(
        source='bill.total')

    class Meta:
        model = PaymentDetails
        fields = ('confirmed_date', 'dealer', 'address',
                  'invoice_number', 'total', 'paid_amount', 'balance')
