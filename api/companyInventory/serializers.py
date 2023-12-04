from rest_framework import serializers
from company_inventory.models import CompanyProducts


class CompanyInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProducts
        fields = ('__all__')


class CompanyInventoryExcelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProducts
        fields = ('category', 'item_code', 'description',
                  'base', 'added_by', 'date')


class GetCompanyInventory(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name')

    class Meta:
        model = CompanyProducts
        fields = ('__all__')


class CompanyProductViewSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source='employee.email')

    class Meta:
        model = CompanyProducts
        fields = ('category', 'item_code', 'description',
                  'base', 'added_by', 'date')


class CompanyProductEditSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompanyProducts
        fields = ('category', 'item_code', 'description',
                  'base', 'added_by', 'date')
