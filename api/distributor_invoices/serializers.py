from rest_framework import serializers
from distributor_invoice.models import DistributorInvoice, DistributorInvoiceItems


class AddInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorInvoice
        fields = ('__all__')


class GetAllInvoiceItems(serializers.ModelSerializer):
    class Meta:
        model = DistributorInvoiceItems
        fields = ('__all__')
