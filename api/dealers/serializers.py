from rest_framework import serializers
from dealer_details.models import Dealer


class AddDealerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealer
        fields = ('__all__')


class GetAllDealersSerializer(serializers.ModelSerializer):
    added = serializers.CharField(source='added_by.user_name')
    psa_name = serializers.CharField(source='psa.area_name')
    category = serializers.CharField(source='category.category_name')

    class Meta:
        model = Dealer
        fields = ('id', 'name', 'contact_number', 'address', 'owner_name', 'company_number', 'owner_personal_number',
                  'owner_home_number', 'assistant_name', 'assistant_contact_number', 'added', 'category', 'psa_name', 'psa', 'grade')


class EditDealersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dealer
        fields = ('name', 'contact_number', 'address', 'owner_name', 'company_number', 'owner_personal_number',
                  'owner_home_number', 'assistant_name', 'assistant_contact_number', 'grade')
