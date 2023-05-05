from rest_framework import serializers
from salesref_return.models import SalesRefReturn, SalesRefReturnItem


class AddReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefReturn
        fields = ('__all__')


class GetReturnsSerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(source='dealer.name')
    added_email = serializers.CharField(source='added_by.email')
    psa_name = serializers.CharField(source='psa.area_name')

    class Meta:
        model = SalesRefReturn
        fields = ('id', 'dealer', 'psa', 'is_return_goods', 'is_deduct_bill',
                  'bill_code', 'bill_number', 'amount', 'date', 'added_by', 'dealer_name', 'added_email', 'psa_name')


class GetItemsSeraializer(serializers.ModelSerializer):
    item_code = serializers.CharField(source='item.item_code')

    class Meta:
        model = SalesRefReturnItem
        fields = ('id', 'salesrefreturn', 'item',
                  'qty', 'foc', 'reason', 'item_code')


# class GetAllPSASerializer(serializers.ModelSerializer):
#     created_by = serializers.CharField(source='created_by.email')

#     class Meta:
#         model = PrimarySalesArea
#         fields = ('created_by', 'area_name', 'more_details', 'id')
