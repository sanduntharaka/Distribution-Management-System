from rest_framework import serializers
from distrubutor_salesref_invoice.models import InvoiceIntem


class AddtionalFocSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='bill.date')
    invoice_number = serializers.CharField(
        source='bill.get_bill_code_number_combine')
    dealer_name = serializers.CharField(source='bill.dealer.name')
    dealer_address = serializers.CharField(source='bill.dealer.address')
    dealer_contact_number = serializers.CharField(
        source='bill.dealer.contact_number')
    category = serializers.CharField(source='item.category.category_name')
    addtional_foc_qty = serializers.IntegerField(source='get_addtional_foc')
    value = serializers.IntegerField(source='get_value')

    class Meta:
        model = InvoiceIntem
        fields = ('foc', 'qty',
                  'date', 'item_code', 'invoice_number', 'dealer_name', 'dealer_address', 'dealer_contact_number', 'category', 'addtional_foc_qty', 'value')

# Date
# Invoice number
# QTY
# FOC
