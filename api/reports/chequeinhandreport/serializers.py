from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails


class ChequeDetailsSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')
    dealer = serializers.CharField(source='bill.dealer.name')
    address = serializers.CharField(source='bill.dealer.address')
    given_date = serializers.CharField(source='bill.date')

    class Meta:
        model = ChequeDetails
        fields = ('dealer', 'address',
                  'invoice_number', 'amount', 'given_date')


class ReturnChequeDetailsSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')
    invoice_date = serializers.DateField(
        source='bill.date')
    original_amount = serializers.FloatField(
        source='bill.total')

    class Meta:
        model = ChequeDetails
        fields = ('invoice_number', 'invoice_date', 'deposited_at',
                  'bank', 'cheque_number', 'original_amount', 'amount')
