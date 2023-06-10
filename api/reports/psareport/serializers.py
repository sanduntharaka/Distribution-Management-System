from rest_framework import serializers
from dealer_details.models import Dealer


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealer
        fields = ('id', 'date', 'total')
