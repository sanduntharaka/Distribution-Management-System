from rest_framework import serializers
from dealer_category.models import DealerCategory


class CreateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DealerCategory
        fields = ('__all__')


class EditCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DealerCategory
        fields = ('category_name', 'details')


class GetAllCategorySerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source='added_by.user_name')

    class Meta:
        model = DealerCategory
        fields = ('created_by', 'category_name', 'details', 'id')
