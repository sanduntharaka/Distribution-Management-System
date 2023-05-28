from rest_framework import serializers
from salesref_return.models import SalesRefReturn, SalesRefReturnItem


class SalesReturnSerializer(serializers.ModelSerializer):
    psa = serializers.CharField(source='psa.area_name')
    dealer = serializers.CharField(source='dealer.name')

    class Meta:
        model = SalesRefReturn
        fields = ('dealer', 'psa', 'is_return_goods', 'is_deduct_bill',
                  'bill_code', 'bill_number', 'amount', 'date')


class SalesReturnItemsSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='item.item_code')
    # description = serializers.CharField(source='item.description')
    # date = serializers.CharField(source='salesrefreturn.date')
    # bill = serializers.CharField(source='salesrefreturn.getbillnumber')
    # price = serializers.CharField(source='item.retail_price')
    sub_total = serializers.FloatField(source='total')

    class Meta:
        model = SalesRefReturnItem
        fields = ('item', 'reason', 'qty',  'sub_total')
        # 'foc','bill', 'price', 'date', 'description',
