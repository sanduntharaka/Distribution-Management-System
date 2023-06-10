from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice


class NormalPsaSerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(source='dealer.name')
    dealer_address = serializers.CharField(source='dealer.address')
    dealer_contact = serializers.CharField(source='dealer.contact_number')
    dealer_category = serializers.CharField(
        source='dealer.category.category_name')
    qty = serializers.CharField(source='get_qty')
    foc = serializers.CharField(source='get_foc')

    class Meta:
        model = SalesRefInvoice
        fields = ('date', 'dealer_name', 'dealer_address',
                  'dealer_contact', 'dealer_category', 'qty', 'foc', 'total')
