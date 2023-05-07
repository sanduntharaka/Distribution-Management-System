from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateDisributorSalesRef (generics.CreateAPIView):
    serializer_class = serializers.CreateDistributorSalesRefSerializer
    queryset = SalesRefDistributor.objects.all()


class Getinventory (generics.RetrieveAPIView):
    serializer_class = serializers.DistributorInventory

    def get_object(self, *args, **kwargs):
        distributor = SalesRefDistributor.objects.get(
            sales_ref=self.kwargs.get('id')).distributor
        return get_object_or_404(DistributorInventory, distributor=distributor)


class GetinventoryItems (generics.ListAPIView):
    serializer_class = serializers.DistributorInventoryItems

    def get_queryset(self, *args, **kwargs):
        return get_list_or_404(DistributorInventoryItems, inventory=self.kwargs.get('pk'))

#


class GetAlldistributorSalesRef(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer
    queryset = SalesRefDistributor.objects.all()


class GetBySalesRef(generics.RetrieveAPIView):
    serializer_class = serializers.CreateDistributorSalesRefSerializer

    def get_object(self, *args, **kwargs):
        return get_object_or_404(SalesRefDistributor, sales_ref=self.kwargs.get('id'))


class GetAllByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(SalesRefDistributor, distributor=item)


class DeleteDisributorSalesRef(generics.DestroyAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer
    serializer_class = serializers.CreateDistributorSalesRefSerializer
