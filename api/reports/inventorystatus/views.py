from rest_framework import status
from rest_framework.response import Response
from inventory_history.models import DistributorHistoryItem
from distributor_inventory.models import DistributorInventory
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from userdetails.models import UserDetails
from distrubutor_salesref.models import SalesRefDistributor


class GetFocReport(APIView):
    def post(self, request, *args, **kwargs):
        date = request.data['date']
        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor
            inventory = DistributorInventory.objects.get(
                distributor=distributor).id

        else:

            inventory = DistributorInventory.objects.get(
                distributor=request.data['distributor']).id

        filters = {
            'item__item__inventory': inventory,
            'date': date
        }

        items = DistributorHistoryItem.objects.filter(
            **filters)
        serializer = serializers.InventoryStatusSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
#
