from rest_framework import serializers
from sales_return.models import SalesReturn, SalesReturnItem


class SalesReturnSerializer(serializers.ModelSerializer):
    psa = serializers.CharField(source='psa.area_name')
    dealer = serializers.CharField(source='dealer.name')

    class Meta:
        model = SalesReturn
        fields = ('dealer', 'psa', 'is_return_goods', 'is_deduct_bill',
                  'bill_code', 'bill_number', 'amount', 'date')


class SalesReturnItemsSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='item.item.item_code')
    item_description = serializers.CharField(source='item.item.description')
    # description = serializers.CharField(source='item.description')
    # date = serializers.CharField(source='salesrefreturn.date')
    # bill = serializers.CharField(source='salesrefreturn.getbillnumber')
    # price = serializers.CharField(source='item.retail_price')
    sub_total = serializers.FloatField(source='total')

    class Meta:
        model = SalesReturnItem
        fields = ('item', 'reason', 'qty',  'sub_total', 'item_description')
        # 'foc','bill', 'price', 'date', 'description',
