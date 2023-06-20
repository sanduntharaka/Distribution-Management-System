from rest_framework import status
from rest_framework.response import Response
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateDisributorSalesRef (generics.CreateAPIView):
    serializer_class = serializers.CreateDistributorSalesRefSerializer
    queryset = SalesRefDistributor.objects.all()


class GetinventoryBySalesref (generics.RetrieveAPIView):
    serializer_class = serializers.DistributorInventory

    def get_object(self, *args, **kwargs):
        distributor = SalesRefDistributor.objects.get(
            sales_ref=self.kwargs.get('id')).distributor
        return get_object_or_404(DistributorInventory, distributor=distributor)


class GetinventoryByDistributor (generics.RetrieveAPIView):
    serializer_class = serializers.DistributorInventory

    def get_object(self, *args, **kwargs):
        distributor = SalesRefDistributor.objects.get(
            distributor=self.kwargs.get('id')).distributor
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


class GetByDistributor(generics.RetrieveAPIView):
    serializer_class = serializers.CreateDistributorSalesRefSerializer

    def get_object(self, *args, **kwargs):
        return get_object_or_404(SalesRefDistributor, distributor=self.kwargs.get('id'))


class GetAllByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(SalesRefDistributor, distributor=item)


class DeleteDisributorSalesRef(generics.DestroyAPIView):
    queryset = SalesRefDistributor.objects.all()
    serializer_class = serializers.CreateDistributorSalesRefSerializer


class GetDistributorBySr(generics.RetrieveAPIView):
    serializer_class = serializers.GetDistributorDetails

    def get_object(self, *args, **kwargs):
        return get_object_or_404(SalesRefDistributor, sales_ref=self.kwargs.get('id'))


class GetDistributorByDistributor(generics.RetrieveAPIView):
    serializer_class = serializers.GetDistributorDetails

    def get(self, *args, **kwargs):
        salesref_distributor = SalesRefDistributor.objects.filter(distributor=self.kwargs.get('id')).first()
        data = {
            "full_name":salesref_distributor.distributor.full_name,
            "address":salesref_distributor.distributor.address,
            "company_number":salesref_distributor.distributor.company_number,
        }
        return Response(data=data,status=status.HTTP_200_OK)


class GetAllSalesrefsByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        # all_salesrefs = SalesRefDistributor.objects.filter(distributor=item)
        return get_list_or_404(SalesRefDistributor, distributor=item)


class GetAllSalesrefsByManager(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        all_distributors = ManagerDistributor.objects.filter(
            manager=item).values('distributor')
        distributor_ids = [i['distributor'] for i in all_distributors]
        # all_salesrefs = SalesRefDistributor.objects.filter(distributor=item)
        print('called')
        return get_list_or_404(SalesRefDistributor, distributor__in=distributor_ids)
