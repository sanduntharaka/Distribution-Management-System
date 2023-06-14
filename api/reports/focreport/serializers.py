from rest_framework import serializers
from distrubutor_salesref_invoice.models import InvoiceIntem


class FocSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='bill.date')
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')

    class Meta:
        model = InvoiceIntem
        fields = ('foc', 'qty',
                  'date', 'invoice_number')

# Date
# Invoice number
# QTY
# FOC
