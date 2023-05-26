from rest_framework import serializers
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems


class InventoryItemsSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.category_name')

    class Meta:
        model = DistributorInventoryItems
        fields = ('id', 'item_code', 'description', 'qty',
                  'foc', 'whole_sale_price', 'retail_price', 'category')
