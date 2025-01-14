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
    added_contact = serializers.CharField(source='added_by.company_number')

    psa_name = serializers.CharField(source='psa.area_name')
    code = serializers.CharField(source='getbillnumber')
    distributor = serializers.CharField(
        source='dis_sales_ref.distributor.full_name')
    distributor_address = serializers.CharField(
        source='dis_sales_ref.distributor.address')
    distributor_company_number = serializers.CharField(
        source='dis_sales_ref.distributor.company_number')

    class Meta:
        model = SalesRefReturn
        fields = ('id', 'dealer', 'psa', 'is_return_goods', 'is_deduct_bill',
                  'bill_code', 'bill_number', 'amount', 'date', 'added_by', 'status', 'added_contact', 'dealer_name', 'added_name', 'code', 'psa_name', 'dealer_address', 'contact_number', 'distributor', 'distributor_address', 'distributor_company_number')


class GetItemsSeraializer(serializers.ModelSerializer):
    item_code = serializers.CharField(source='inventory_item.item_code')
    item_description = serializers.CharField(
        source='inventory_item.description')

    class Meta:
        model = SalesRefReturnItem
        fields = ('id', 'salesrefreturn',
                  'qty', 'foc', 'reason', 'item_code', 'item_description')


class CreateSalesReturnItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefReturnItem
        fields = ('__all__')


# class GetAllPSASerializer(serializers.ModelSerializer):
#     created_by = serializers.CharField(source='created_by.email')

#     class Meta:
#         model = PrimarySalesArea
#         fields = ('created_by', 'area_name', 'more_details', 'id')
