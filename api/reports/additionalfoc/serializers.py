from rest_framework import serializers
from distrubutor_salesref_invoice.models import Item


class AddtionalFocSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='invoice_item.bill.date')
    invoice_number = serializers.CharField(
        source='invoice_item.bill.get_bill_code_number_combine')
    dealer_name = serializers.CharField(source='invoice_item.bill.dealer.name')
    dealer_address = serializers.CharField(source='invoice_item.bill.dealer.address')
    dealer_contact_number = serializers.CharField(
        source='invoice_item.bill.dealer.contact_number')
    category = serializers.CharField(source='item.item.category.category_name')
    addtional_foc_qty = serializers.IntegerField(source='invoice_item.get_addtional_foc')
    value = serializers.IntegerField(source='invoice_item.get_value')
    item_code = serializers.CharField(source='invoice_item.item_code')
    foc=serializers.FloatField(source='invoice_item.foc')
    qty=serializers.IntegerField(source='invoice_item.qty')
    discount=serializers.FloatField(source='invoice_item.discount')
    class Meta:
        model = Item
        fields = ('foc', 'qty',
                  'date', 'item_code', 'discount', 'invoice_number', 'dealer_name', 'dealer_address', 'dealer_contact_number', 'category', 'addtional_foc_qty', 'value')

# Date
# Invoice number
# QTY
# FOC
