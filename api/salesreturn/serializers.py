from rest_framework import serializers
from sales_return.models import SalesReturn, SalesReturnItem


class AddReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReturn
        fields = ('__all__')


class GetReturnsSerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(source='dealer.name')
    added_email = serializers.CharField(source='added_by.email')
    psa_name = serializers.CharField(source='psa.area_name')

    class Meta:
        model = SalesReturn
        fields = ('id', 'dealer', 'psa', 'is_return_goods', 'is_deduct_bill',
                  'bill_code', 'bill_number', 'amount', 'date', 'added_by', 'dealer_name', 'added_email', 'psa_name')


class GetItemsSeraializer(serializers.ModelSerializer):
    item_code = serializers.CharField(source='item.item_code')

    class Meta:
        model = SalesReturnItem
        fields = ('id', 'salesreturn', 'item',
                  'qty', 'reason', 'item_code')
