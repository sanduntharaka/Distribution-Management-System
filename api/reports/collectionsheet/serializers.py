from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails


class PyementDetailsSerializer(serializers.ModelSerializer):

    cash = serializers.CharField(source='get_cash')
    credit = serializers.CharField(source='get_credit')
    cheque = serializers.CharField(source='get_cheque')

    class Meta:
        model = PaymentDetails
        fields = ('id', 'date', 'cash', 'credit', 'cheque')
