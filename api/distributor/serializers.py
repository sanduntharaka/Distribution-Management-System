from rest_framework import serializers
from distributor_inventory.models import DistributorInventoryItems, DistributorInventory


class AddItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventoryItems
        fields = ('__all__')


class EditItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventoryItems
        fields = ('item_code', 'description', 'base', 'qty',
                  'pack_size', 'foc', 'whole_sale_price', 'retail_price')


class GetInventory(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventory
        fields = ('__all__')


class GetInventoryItems(serializers.ModelSerializer):

    class Meta:
        model = DistributorInventoryItems
        fields = ('id', 'item_code', 'qty', 'foc', 'added_by', 'description',
                  'base', 'pack_size', 'whole_sale_price', 'retail_price')
