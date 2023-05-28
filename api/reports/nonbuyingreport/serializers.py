from rest_framework import serializers
from not_buy_details.models import NotBuyDetails


class NonBuyDetailsSerializer(serializers.ModelSerializer):
    dealer = serializers.CharField(source='dealer.name')
    psa = serializers.CharField(source='dealer.psa.area_name')
    reason = serializers.CharField(source='get_reson')

    class Meta:
        model = NotBuyDetails
        fields = ('dealer', 'psa',
                  'reason')
