from django.db.models import Subquery, OuterRef
from django.db.models import Q
from rest_framework.views import APIView
from itertools import chain
from django.db.models import Sum, F, Q
from django.db.models.functions import Coalesce
from rest_framework import filters
from exceutive_manager.models import ExecutiveManager
from rest_framework import status
from rest_framework.response import Response
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems, ItemStock
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
        return get_list_or_404(ItemStock, item__inventory=self.kwargs.get('pk'), qty__gt=0)


class GetinventoryItemsSearch (APIView):
    serializer_class = serializers.DistributorInventoryItems
    # filter_backends = [filters.SearchFilter]
    # search_fields = ('item__item_code', 'item__description')

    def get(self, request, *args, **kwargs):
        # Retrieve ItemStock data for the specific distributor inventory
        try:
            print(1)
            inventory_id = kwargs.get('pk')
            queryset = ItemStock.objects.filter(Q(qty__gt=0) | Q(foc__gt=0),
                                                item__inventory=inventory_id)

            # Separate data for the same price and different prices
            same_price_data = queryset.values('whole_sale_price', 'retail_price', 'item__id', 'item__item_code', 'item__description').annotate(
                total_qty=Sum('qty'), total_foc=Sum('foc')
            )

            # Retrieve data for different prices
            print(2)
            different_price_data = queryset.exclude(
                Q(whole_sale_price__in=same_price_data.values('whole_sale_price')) &
                Q(retail_price__in=same_price_data.values('retail_price'))
            )

            # Combine data for same price and different prices
            combined_queryset = list(
                chain(same_price_data, different_price_data))

            # Get the search term from the request
            search_term = self.request.GET.get('search', '')
            print(3)
            # Manually filter based on the search term
            filtered_queryset = [
                {
                    'item_code': item['item__item_code'],
                    'description': item['item__description'],
                    'id': item['item__id'],
                    'whole_sale_price': item['whole_sale_price'],
                    'retail_price': item['retail_price'],
                    'qty': item['total_qty'],
                    'foc': item['total_foc']
                }
                for item in combined_queryset
                if search_term.lower() in item['item__item_code'].lower() or search_term.lower() in item['item__description'].lower()
            ]

            item_stock_ids = ItemStock.objects.values('item').distinct()

            # Query DistributorInventoryItems excluding those in ItemStock
            items_not_in_stock = DistributorInventoryItems.objects.exclude(
                id__in=Subquery(item_stock_ids))

            for item in items_not_in_stock:
                filtered_queryset.append({
                    'item_code': item.item_code,
                    'description': item.description,
                    'id': item.id,
                    'whole_sale_price': 0,
                    'retail_price': 0,
                    'qty': 0,
                    'foc': 0
                })

            return Response(data=filtered_queryset, status=status.HTTP_200_OK)
        except Exception as e:
            print('ii', e)
            return Response(data={'error': e}, status=status.HTTP_200_OK)


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


class GetByDistributorSingle(generics.RetrieveAPIView):
    serializer_class = serializers.CreateDistributorSalesRefSerializer

    def get(self, *args, **kwargs):

        salesre_distributor = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).first()
        return Response(data=salesre_distributor.id)


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
        salesref_distributor = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).first()
        data = {
            "full_name": salesref_distributor.distributor.full_name,
            "address": salesref_distributor.distributor.address,
            "company_number": salesref_distributor.distributor.company_number,
        }
        return Response(data=data, status=status.HTTP_200_OK)


class GetAllSalesrefsByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(SalesRefDistributor, distributor=item)


class GetAllSalesrefsByManager(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        distributor_ids = ManagerDistributor.objects.filter(
            manager=item).values_list('distributor', flat=True)

        return get_list_or_404(SalesRefDistributor, distributor__in=distributor_ids)


class GetAllSalesrefsByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetDistributorSalesRefSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        distributor_ids = ManagerDistributor.objects.filter(
            manager__in=ExecutiveManager.objects.filter(
                executive=item).values('manager')
        ).values_list('distributor', flat=True)

        return get_list_or_404(SalesRefDistributor, distributor__in=distributor_ids)
