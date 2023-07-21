from rest_framework import serializers
from past_invoice_data.models import PastInvoice, PastCheque


class AddInvSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastInvoice
        fields = ('__all__')


class ViewInvSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer_name.name')

    class Meta:
        model = PastInvoice
        fields = ('inv_date', 'inv_number', 'customer_name',
                  'original_amount', 'paid_amount', 'balance_amount', 'date')


class UpdateInvSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastInvoice
        fields = ('inv_date', 'inv_number', 'customer_name',
                  'original_amount', 'paid_amount', 'balance_amount')


class AddChequeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastCheque
        fields = ('__all__')


class ViewChequeSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer_name.name')

    class Meta:
        model = PastCheque
        fields = ('inv_date', 'inv_number', 'cheque_number', 'bank', 'cheque_deposite_date',
                  'customer_name', 'original_amount', 'paid_amount', 'balance_amount', 'date')


class UpdateChequeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastCheque
        fields = ('inv_date', 'inv_number', 'customer_name',
                  'original_amount', 'paid_amount', 'balance_amount', 'cheque_number', 'bank', 'cheque_deposite_date')
