from rest_framework import serializers

from company_invoice.models import CompanyInvoice, CompanyInvoiceItems


class AddInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInvoice
        fields = ('__all__')


class GetInvoiceSerializer(serializers.ModelSerializer):
    invoice_code = serializers.CharField(source='get_invoice_number')
    solled_name = serializers.CharField(source='solled_to.full_name')
    isssued_name = serializers.CharField(source='issued_by.email')

    class Meta:
        model = CompanyInvoice
        fields = ('id', 'invoice_code', 'invoice_number', 'issued_by',
                  'solled_to', 'date', 'invoice_code', 'solled_name', 'isssued_name')


class GetAllInvoiceItems(serializers.ModelSerializer):
    class Meta:
        model = CompanyInvoiceItems
        fields = ('__all__')
