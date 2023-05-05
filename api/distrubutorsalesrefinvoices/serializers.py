from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem


class CreateInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'dis_sales_ref', 'date', 'bill_code', 'bill_number',
                  'dealer', 'total', 'discount', 'payment_type', 'added_by')


class CreateInvoiceItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceIntem
        fields = ('__all__')


class GetInvoicesSerializer(serializers.ModelSerializer):
    code = serializers.CharField(
        source='get_bill_code_number_combine')
    distributor = serializers.CharField(
        source='dis_sales_ref.distributor.full_name')
    sales_ref = serializers.CharField(
        source='dis_sales_ref.sales_ref.full_name')
    dealer_name = serializers.CharField(
        source='dealer.name')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'dis_sales_ref', 'date', 'bill_code', 'bill_number',
                  'dealer', 'total', 'discount', 'payment_type', 'added_by', 'code', 'distributor', 'sales_ref', 'dealer_name')
