from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails


class OutstandingSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='get_bill_code_number_combine')
    invoice_amount = serializers.FloatField(source='total')
    balance_amount = serializers.FloatField(source='get_balance')
    total_payed = serializers.FloatField(source='get_payed')
    due_date = serializers.CharField(source='get_due_date')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'date',
                  'invoice_number', 'invoice_amount', 'balance_amount', 'due_date', 'total_payed')


# Invoice number
# Invoice date
# Original amount
# balance amount
# due date
