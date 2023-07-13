from rest_framework import status
from rest_framework.response import Response
from inventory_history.models import DistributorHistoryItem
from distributor_inventory.models import DistributorInventory
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class GetFocReport(APIView):
    def post(self, request, *args, **kwargs):
        user = self.kwargs.get('id')
        date = request.data['date']
        inventory = DistributorInventory.objects.get(distributor=user).id
        filters = {
            'item__item__inventory': inventory,
            'date': date
        }

        items = DistributorHistoryItem.objects.filter(
            **filters)
        serializer = serializers.InventoryStatusSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
#
