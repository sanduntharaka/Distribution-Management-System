from rest_framework import serializers
from userdetails.models import UserDetails


class AllStaffDetailsSerializer(serializers.ModelSerializer):
    id_number = serializers.CharField(source='nic')
    terriotory = serializers.CharField(source='getTerrotories')

    class Meta:
        model = UserDetails
        fields = ('id', 'full_name', 'address', 'designation',
                  'personal_number', 'terriotory', 'id_number')
