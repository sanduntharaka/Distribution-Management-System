from rest_framework import serializers
from manager_distributor.models import ManagerDistributor


class CreateManagerDistributorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerDistributor
        fields = ('__all__')


class GetManagerDistributorsSerializer(serializers.ModelSerializer):
    distributor_name = serializers.CharField(source='distributor.full_name')
    manager_name = serializers.CharField(source='manager.full_name')

    class Meta:
        model = ManagerDistributor
        fields = ('id', 'added_by', 'distributor', 'manager',
                  'distributor_name', 'manager_name')
