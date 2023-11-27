from rest_framework import serializers
from distributor_inventory.models import DistributorInventoryItems, DistributorInventory, ItemStock, DistributorItemsInvoice
from distrubutor_salesref.models import SalesRefDistributor


class AddItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorInventoryItems
        fields = ('__all__')


class AddInvoiceDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorItemsInvoice
        fields = ('__all__')


class AddItemDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemStock
        fields = ('__all__')

    def create(self, validated_data):
        # Set initial_qty and initial_foc to the current qty and foc values respectively
        initial_qty = validated_data.get('qty')
        initial_foc = validated_data.get('foc')

        # Remove initial_qty and initial_foc from the validated data before creating the object
        # As they are not part of the model fields
        validated_data.pop('initial_qty', None)
        validated_data.pop('initial_foc', None)

        # Create the ItemStock object with the updated validated data
        item_stock = ItemStock.objects.create(
            initial_qty=initial_qty,
            initial_foc=initial_foc,
            **validated_data
        )

        return item_stock


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
                  'base', 'pack_size', 'date', 'whole_sale_price', 'retail_price', 'from_sales_return', 'category_name', 'invoice_number')


class GetInventoryItems(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name')
    qty = serializers.IntegerField(source='get_total_qty')
    foc = serializers.IntegerField(source='get_total_foc')

    class Meta:
        model = DistributorInventoryItems
        fields = ('id', 'item_code', 'description',
                  'base', 'category_name', 'qty', 'foc', 'category')


class MySalesrefs(serializers.ModelSerializer):
    full_name = serializers.CharField(source='sales_ref.full_name')
    salesref_id = serializers.CharField(source='sales_ref.id')

    class Meta:
        model = SalesRefDistributor
        fields = ('id', 'full_name', 'salesref_id')
