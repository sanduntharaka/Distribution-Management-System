from rest_framework import serializers
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems, ItemStock


class InventoryItemsSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='item.category.category_name')
    item_code = serializers.CharField(source='item.item_code')
    description = serializers.CharField(source='item.description')

    class Meta:
        model = ItemStock
        fields = ('id', 'item_code', 'description', 'qty',
                  'foc', 'whole_sale_price', 'retail_price', 'category')
