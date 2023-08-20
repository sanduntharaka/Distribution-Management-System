from rest_framework import serializers
from targets.models import DistributorTargets, SalesrefTargets


class AddDistributorTargetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorTargets
        fields = ('__all__')


class ShowDistributorTargetsSerializer(serializers.ModelSerializer):
    distributor_name = serializers.CharField(
        source='manager_distributor.distributor.full_name')
    category_name = serializers.CharField(source='category.category_name')

    class Meta:
        model = DistributorTargets
        fields = ('manager_distributor',
                  'date_form',
                  'date_to',
                  'category',
                  'amount',
                  'added_by', 'distributor_name',
                  'category_name', 'id')


class EditDistributorTargetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorTargets
        fields = ('date_form', 'date_to', 'amount')


class AddSalesrepTargetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesrefTargets
        fields = ('__all__')


class ShowSalesrepTargetsSerializer(serializers.ModelSerializer):
    salesrep_name = serializers.CharField(
        source='salesrep_distributor.sales_ref.full_name')
    category_name = serializers.CharField(source='category.category_name')

    class Meta:
        model = SalesrefTargets
        fields = ('salesrep_distributor',
                  'date_form',
                  'date_to',
                  'category',
                  'amount',
                  'added_by', 'salesrep_name',
                  'category_name', 'id')


class EditSalesrepTargetsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesrefTargets
        fields = ('date_form', 'date_to', 'amount')
