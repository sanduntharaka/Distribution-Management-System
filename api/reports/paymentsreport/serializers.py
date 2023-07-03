from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails


class PendingInvoiceSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')
    cash = serializers.FloatField(source='get_cash')
    cheque = serializers.FloatField(source='get_cheque')
    credit = serializers.FloatField(source='get_credit')

    class Meta:
        model = PaymentDetails
        fields = ('date', 'invoice_number', 'cash', 'cheque', 'credit')
