from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails


class PyementDetailsSerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(source='bill.dealer.name')
    address = serializers.CharField(source='bill.dealer.address')
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')
    invoice_amount = serializers.CharField(source='bill.total')

    cheque_number = serializers.CharField(source='get_cheque_number')
    cheque_date = serializers.CharField(source='get_cheque_date')
    cheque_bank = serializers.CharField(source='get_cheque_bank')
    cheque_amount = serializers.CharField(source='get_cheque_amount')

    class Meta:
        model = PaymentDetails
        fields = ('id', 'date', 'paid_amount', 'payment_type', 'dealer_name',
                  'address', 'invoice_number', 'invoice_amount', 'cheque_number', 'cheque_date', 'cheque_bank', 'cheque_amount')
