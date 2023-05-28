from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice


class PendingInvoiceSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(
        source='get_bill_code_number_combine')
    dealer = serializers.CharField(source='dealer.name')
    address = serializers.CharField(source='dealer.address')

    class Meta:
        model = SalesRefInvoice
        fields = ('date', 'dealer', 'address', 'total',
                  'invoice_number')
