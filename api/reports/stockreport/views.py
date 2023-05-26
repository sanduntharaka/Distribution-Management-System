from rest_framework import status
from rest_framework.response import Response
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class GetInventoryReport(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        stock_type = int(request.data['stock_type'])
        category = int(request.data['category'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        inventory = DistributorInventory.objects.get(distributor=item)

        filters = {
            'inventory': inventory,
            'qty__gte': 0,
        }
        if stock_type == 0:
            filters['qty'] = 0

        if by_date:
            filters['date__range'] = (date_from, date_to)

        if category != -1:
            filters['category'] = category

        items = DistributorInventoryItems.objects.filter(**filters)
        serializer = serializers.InventoryItemsSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
