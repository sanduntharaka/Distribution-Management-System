from rest_framework import serializers
from past_invoice_data.models import PastCheque, PastInvoice


class PastInvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer_name.name')
    distributor = serializers.CharField(source='distributor.full_name')

    class Meta:
        model = PastInvoice
        fields = ('id', 'distributor', 'inv_date', 'inv_number', 'customer_name',
                  'original_amount', 'paid_amount', 'balance_amount', 'date')


class PastChequeSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer_name.name')
    distributor = serializers.CharField(source='distributor.full_name')

    class Meta:
        model = PastCheque
        fields = ('id', 'distributor', 'inv_date', 'inv_number', 'customer_name',
                  'original_amount', 'paid_amount', 'balance_amount', 'date', 'cheque_number', 'bank', 'cheque_deposite_date')
