from rest_framework import serializers
from salesref_return.models import SalesRefReturn, SalesRefReturnItem


class AddReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefReturn
        fields = ('__all__')


class UpdateReturnStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefReturn
        fields = ('status')


class GetReturnsSerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(source='dealer.name')
    dealer_address = serializers.CharField(source='dealer.address')
    contact_number = serializers.CharField(source='dealer.contact_number')
    added_name = serializers.CharField(source='added_by.full_name')
    psa_name = serializers.CharField(source='psa.area_name')
    code = serializers.CharField(source='getbillnumber')
    distributor = serializers.CharField(
        source='dis_sales_ref.distributor.full_name')

    class Meta:
        model = SalesRefReturn
        fields = ('id', 'dealer', 'psa', 'is_return_goods', 'is_deduct_bill',
                  'bill_code', 'bill_number', 'amount', 'date', 'added_by', 'dealer_name', 'added_name', 'code', 'psa_name', 'dealer_address', 'contact_number', 'distributor')


class GetItemsSeraializer(serializers.ModelSerializer):
    item_code = serializers.CharField(source='item.item_code')

    class Meta:
        model = SalesRefReturnItem
        fields = ('id', 'salesrefreturn', 'item',
                  'qty', 'foc', 'reason', 'item_code')


class CreateSalesReturnItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefReturnItem
        fields = ('__all__')


# class GetAllPSASerializer(serializers.ModelSerializer):
#     created_by = serializers.CharField(source='created_by.email')

#     class Meta:
#         model = PrimarySalesArea
#         fields = ('created_by', 'area_name', 'more_details', 'id')
