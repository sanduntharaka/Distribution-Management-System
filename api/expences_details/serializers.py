from rest_framework import serializers
from expences.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


class ExpenseEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = (
            'amount',
            'date',
            'reason')
