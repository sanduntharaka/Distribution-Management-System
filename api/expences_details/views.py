
from rest_framework import status
from rest_framework.response import Response
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404
from . import serializers
from expences.models import Expense


class AddExpences_details(generics.CreateAPIView):
    serializer_class = serializers.ExpenseSerializer
    queryset = Expense.objects.all()


class AllExpences_details(generics.ListAPIView):
    serializer_class = serializers.ExpenseSerializer

    def get_queryset(self):
        id = self.kwargs['id']
        return get_list_or_404(Expense, inventory_id=id)
