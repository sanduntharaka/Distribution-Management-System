from rest_framework import status
from rest_framework.response import Response
from inventory_history.models import DistributorHistoryItem
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class GetFocReport(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date =request.data['date']

        filters = {
            'item__inventory__distributor': item,
            'date': date
        }

        items = DistributorHistoryItem.objects.filter(**filters)
        serializer = serializers.InventoryStatusSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
#
