from rest_framework import serializers
from distrubutor_salesref_invoice.models import InvoiceIntem,Item


class FocSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='invoice_item.bill.date')
    invoice_number = serializers.CharField(
        source='invoice_item.bill.get_bill_code_number_combine')

    class Meta:
        model = Item
        fields = ('foc', 'qty',
                  'date', 'invoice_number')

# Date
# Invoice number
# QTY
# FOC
