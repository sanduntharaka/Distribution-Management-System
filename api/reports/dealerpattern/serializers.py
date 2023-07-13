from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails, InvoiceIntem
from dealer_details.models import Dealer


class GetDealerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealer
        fields = ('id', 'name')


class DealerInvoicesSerializer(serializers.ModelSerializer):
    code = serializers.CharField(source='get_bill_code_number_combine')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'code')


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceIntem
        fields = ('id', 'item_code', 'qty', 'foc',
                  'price', 'discount', 'description', 'extended_price')


class InvoicePaymentSerializer(serializers.ModelSerializer):
    invoice_date = serializers.DateField(source='bill.date')
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')
    invoice_amount = serializers.FloatField(source='bill.total')

    class Meta:
        model = PaymentDetails
        fields = ('id', 'payment_type', 'date', 'paid_amount',
                  'invoice_date', 'invoice_number', 'invoice_amount')
