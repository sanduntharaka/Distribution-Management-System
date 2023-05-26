from rest_framework import serializers
from dealer_details.models import Dealer


class DealerDetailsSerializer(serializers.ModelSerializer):
    psa = serializers.CharField(source='psa.area_name')
    category = serializers.CharField(source='category.category_name')

    class Meta:
        model = Dealer
        fields = ('name', 'contact_number', 'address', 'assistant_name',
                  'assistant_contact_number', 'psa', 'category')
