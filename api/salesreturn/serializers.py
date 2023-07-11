from rest_framework import serializers
from sales_return.models import SalesReturn, SalesReturnItem


class AddReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReturn
        fields = ('__all__')


class UpdateReturnStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReturn
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
        model = SalesReturn
        fields = ('id', 'dealer', 'psa', 'is_return_goods', 'is_deduct_bill',
                  'bill_code', 'bill_number', 'amount', 'date', 'code', 'added_by', 'added_contact', 'added_name', 'dealer_name', 'psa_name', 'dealer_address', 'contact_number', 'distributor', 'distributor_address', 'distributor_company_number')


class GetItemsSeraializer(serializers.ModelSerializer):
    item_code = serializers.CharField(source='item.item.item_code')

    class Meta:
        model = SalesReturnItem
        fields = ('id', 'salesreturn', 'item',
                  'qty', 'foc', 'reason', 'item_code')


class CreateSalesReturnItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesReturnItem
        fields = ('__all__')
