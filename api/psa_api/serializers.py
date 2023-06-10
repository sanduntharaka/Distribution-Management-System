from rest_framework import serializers
from primary_sales_area.models import PrimarySalesArea


class CreatePSASerializer(serializers.ModelSerializer):
    class Meta:
        model = PrimarySalesArea
        fields = ('__all__')


class EditPsaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrimarySalesArea
        fields = ('area_name', 'more_details')


class GetAllPSASerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source='created_by.user_name')

    class Meta:
        model = PrimarySalesArea
        fields = ('created_by', 'area_name', 'more_details', 'id')
