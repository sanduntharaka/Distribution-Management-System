from rest_framework import serializers
from exceutive_manager.models import ExecutiveManager


class CreateExecutiveManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutiveManager
        fields = ('__all__')


class GetExecutiveManagerSerializer(serializers.ModelSerializer):
    executive_name = serializers.CharField(source='executive.full_name')
    manager_name = serializers.CharField(source='manager.full_name')

    class Meta:
        model = ExecutiveManager
        fields = ('id', 'added_by', 'executive', 'manager',
                  'executive_name', 'manager_name')
