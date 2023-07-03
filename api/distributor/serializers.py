from rest_framework import serializers
from distributor_inventory.models import DistributorInventoryItems, DistributorInventory, ItemStock


class AddItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventoryItems
        fields = ('__all__')


class AddItemDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemStock
        fields = ('__all__')


class EditItemsSerializer(serializers.ModelSerializer):

    class Meta:
        model = DistributorInventoryItems
        fields = ('item_code', 'description', 'base', 'category')


class EditStockSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemStock
        fields = ('from_sales_return', 'invoice_number', 'qty',
                  'pack_size', 'foc', 'whole_sale_price', 'retail_price')


class GetInventory(serializers.ModelSerializer):

    class Meta:
        model = DistributorInventory
        fields = ('__all__')


class GetInventoryItemsStoks(serializers.ModelSerializer):
    category_name = serializers.CharField(source='item.category.category_name')
    item_code = serializers.CharField(source='item.item_code')
    description = serializers.CharField(source='item.description')
    base = serializers.CharField(source='item.base')

    class Meta:
        model = ItemStock
        fields = ('id', 'item_code', 'qty', 'foc', 'added_by', 'description',
                  'base', 'pack_size', 'date', 'whole_sale_price', 'retail_price', 'category_name', 'invoice_number')


class GetInventoryItems(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name')
    qty = serializers.IntegerField(source='get_total_qty')
    foc = serializers.IntegerField(source='get_total_foc')

    class Meta:
        model = DistributorInventoryItems
        fields = ('id', 'item_code', 'description',
                  'base', 'category_name', 'qty', 'foc', 'category')
