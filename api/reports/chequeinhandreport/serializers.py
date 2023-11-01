from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails


class ChequeDetailsSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='payment_details.bill.get_bill_code_number_combine')
    dealer = serializers.CharField(source='payment_details.bill.dealer.name')
    address = serializers.CharField(
        source='payment_details.bill.dealer.address')
    given_date = serializers.CharField(source='payment_details.bill.date')
    psa = serializers.CharField(
        source='payment_details.bill.dealer.psa.area_name')
    banking_date = serializers.CharField(
        source='date')

    class Meta:
        model = ChequeDetails
        fields = ('dealer', 'address',
                  'invoice_number', 'amount', 'given_date', 'cheque_number', 'bank', 'banking_date', 'psa')


class ReturnChequeDetailsSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='payment_details.bill.get_bill_code_number_combine')
    invoice_date = serializers.DateField(
        source='payment_details.bill.date')
    original_amount = serializers.FloatField(
        source='payment_details.bill.total')

    class Meta:
        model = ChequeDetails
        fields = ('invoice_number', 'invoice_date', 'deposited_at',
                  'bank', 'cheque_number', 'original_amount', 'amount')
