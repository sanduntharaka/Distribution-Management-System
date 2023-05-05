from rest_framework import serializers

from company_invoice.models import CompanyInvoice, CompanyInvoiceItems


class AddInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInvoice
        fields = ('__all__')


class GetAllInvoiceItems(serializers.ModelSerializer):
    class Meta:
        model = CompanyInvoiceItems
        fields = ('__all__')
