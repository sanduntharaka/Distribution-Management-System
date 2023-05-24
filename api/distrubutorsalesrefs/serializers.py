from rest_framework import serializers
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems


class CreateDistributorSalesRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefDistributor
        fields = ('__all__')


class GetDistributorSalesRefSerializer(serializers.ModelSerializer):
    distributor_name = serializers.CharField(source='distributor.full_name')
    salesref_name = serializers.CharField(source='sales_ref.full_name')

    class Meta:
        model = SalesRefDistributor
        fields = ('id', 'added_by', 'distributor', 'sales_ref',
                  'distributor_name', 'salesref_name')


class DistributorInventory(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventory
        fields = ('__all__')


class DistributorInventoryItems(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventoryItems
        fields = ('id', 'item_code', 'qty', 'foc', 'added_by', 'description',
                  'base', 'pack_size', 'whole_sale_price', 'retail_price')


class GetDistributorDetails(serializers.ModelSerializer):
    full_name = serializers.CharField(source='distributor.full_name')
    address = serializers.CharField(source='distributor.address')
    company_number = serializers.CharField(source='distributor.company_number')

    class Meta:
        model = SalesRefDistributor
        fields = ('id', 'full_name', 'address', 'company_number')
