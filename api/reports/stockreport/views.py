from rest_framework import status
from rest_framework.response import Response
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems, ItemStock
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404

from distributor_inventory.models import DistributorInventory


class GetInventoryReport(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_company:
            inventory = request.data['distributor']
        if request.user.is_manager:
            inventory = request.data['distributor']

        if request.user.is_distributor:
            inventory = self.kwargs.get('id')

        stock_type = int(request.data['stock_type'])
        category = int(request.data['category'])
        description = int(request.data['item'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        inventory = DistributorInventory.objects.get(distributor=inventory)
        filters = {
            'item__inventory': inventory,
            'qty__gte': 0,
        }
        if stock_type == 0:
            filters['qty'] = 0

        if by_date:
            filters['date__range'] = (date_from, date_to)

        if category != -1:
            filters['item__category'] = category

        if description != -1:
            filters['item__id'] = description

        items = ItemStock.objects.filter(**filters)
        serializer = serializers.InventoryItemsSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
