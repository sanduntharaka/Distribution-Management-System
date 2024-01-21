from rest_framework import serializers
from dealer_details.models import Dealer
from distrubutor_salesref_invoice.models import SalesRefInvoice


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


class GetCreditInvoiceSerializer(serializers.ModelSerializer):
    inv_no = serializers.CharField(source='get_bill_code_number_combine')
    credit_amount = serializers.FloatField(source='total_credit')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'date', 'inv_no', 'total', 'credit_amount')
