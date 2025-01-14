from rest_framework import serializers
from not_buy_details.models import NotBuyDetails


class AddNotBuySerializer(serializers.ModelSerializer):
    class Meta:
        model = NotBuyDetails
        fields = ('__all__')


class GetNotBuySerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(source='dealer.name')
    added_name = serializers.CharField(source='get_added_by_name')

    class Meta:
        model = NotBuyDetails
        fields = ('id', 'dealer', 'datetime', 'is_only_our', 'is_competitor',
                  'is_payment_problem', 'is_dealer_not_in', 'added_by', 'added_name', 'dealer_name')
