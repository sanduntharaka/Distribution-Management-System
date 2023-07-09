from rest_framework import serializers
from executive_distributor.models import ExecutiveDistributor


class CreateExecutiveDistributorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutiveDistributor
        fields = ('__all__')


class GetExecutiveDistributorSerializer(serializers.ModelSerializer):
    executive_name = serializers.CharField(source='executive.full_name')
    distributor_name = serializers.CharField(source='distributor.full_name')

    class Meta:
        model = ExecutiveDistributor
        fields = ('id', 'added_by', 'executive', 'distributor',
                  'executive_name', 'distributor_name')
