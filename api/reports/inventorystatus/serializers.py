from rest_framework import serializers
from inventory_history.models import DistributorHistoryItem


class InventoryStatusSerializer(serializers.ModelSerializer):
    item_code = serializers.CharField(source='item.item.item_code')
    category = serializers.CharField(source='item.item.category.category_name')
    description = serializers.CharField(source='item.item.description')

    class Meta:
        model = DistributorHistoryItem
        fields = ('foc', 'item_code',
                  'category', 'description', 'date', 'qty')

# Date
# Invoice number
# QTY
# FOC
