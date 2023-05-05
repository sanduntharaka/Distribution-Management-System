from rest_framework import serializers
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems


class CreateDistributorSalesRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefDistributor
        fields = ('__all__')


class DistributorInventory(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventory
        fields = ('__all__')


class DistributorInventoryItems(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventoryItems
        fields = ('id', 'item_code', 'qty', 'foc', 'added_by', 'description',
                  'base', 'pack_size', 'whole_sale_price', 'retail_price')
