from rest_framework import serializers
from company_inventory.models import CompanyInventory


class CompanyInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInventory
        fields = ('__all__')


class GetCompanyInventory(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name')

    class Meta:
        model = CompanyInventory
        fields = ('__all__')


class CompanyProductViewSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source='employee.email')

    class Meta:
        model = CompanyInventory
        fields = ('employee', 'id', 'item_code', 'description', 'base', 'qty',
                  'pack_size', 'free_of_charge', 'whole_sale_price', 'retail_price')


class CompanyProductEditSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompanyInventory
        fields = ('item_code', 'description', 'base', 'qty',
                  'pack_size', 'free_of_charge', 'whole_sale_price', 'retail_price')
