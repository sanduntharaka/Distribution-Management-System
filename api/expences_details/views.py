
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


class EditExpences_details(generics.UpdateAPIView):
    serializer_class = serializers.ExpenseEditSerializer
    queryset = Expense.objects.all()

    def update(self, request, *args, **kwargs):
        print(request.data)
        return super().update(request, *args, **kwargs)


class DeleteExpences_details(generics.DestroyAPIView):
    serializer_class = serializers.ExpenseEditSerializer
    queryset = Expense.objects.all()
