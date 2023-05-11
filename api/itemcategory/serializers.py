from rest_framework import serializers
from item_category.models import Category


class CreateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('added_by', 'category_name', 'description')


class GetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('__all__')
