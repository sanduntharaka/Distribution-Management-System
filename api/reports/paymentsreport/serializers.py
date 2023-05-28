from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice


class PendingInvoiceSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='get_bill_code_number_combine')
    cash = serializers.FloatField(source='get_payment_is_cash')
    cheque = serializers.FloatField(source='get_payment_is_cheque')
    credit = serializers.FloatField(source='get_payment_is_credit')

    class Meta:
        model = SalesRefInvoice
        fields = ('date', 'invoice_number', 'cash', 'cheque', 'credit')
