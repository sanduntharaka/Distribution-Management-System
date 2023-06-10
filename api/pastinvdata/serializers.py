from rest_framework import serializers
from past_invoice_data.models import PastInvoice, PastCheque


class AddInvSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastInvoice
        fields = ('__all__')


class AddChequeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastCheque
        fields = ('__all__')
