from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from dealer_details.models import Dealer
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class AllDealerDetails(generics.ListAPIView):
    queryset = Dealer.objects.all()
    serializer_class = serializers.DealerDetailsSerializer


class AllDealerDetailsByDistributor(APIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')
        salesrefs = SalesRefDistributor.objects.filter(
            distributor=item).values('sales_ref')
        salesrefs_ids = [salesref['sales_ref']
                         for salesref in salesrefs]
        salesref_list = UserDetails.objects.filter(
            id__in=salesrefs_ids).values('user')
        salesref_users_id = [sf['user']
                             for sf in salesref_list]

        dealers = Dealer.objects.filter(added_by__in=salesref_users_id)
        serializer = serializers.DealerDetailsSerializer(dealers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllDealerDetailsByManager(APIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')

        distributors = ManagerDistributor.objects.filter(
            manager=item).values('distributor')
        distributors_id = [distributor['distributor']
                           for distributor in distributors]
        salesrefs = SalesRefDistributor.objects.filter(
            distributor__in=distributors_id).values('sales_ref')
        salesrefs_ids = [salesref['sales_ref']
                         for salesref in salesrefs]
        salesref_list = UserDetails.objects.filter(
            id__in=salesrefs_ids).values('user')
        salesref_users_id = [sf['user']
                             for sf in salesref_list]

        dealers = Dealer.objects.filter(added_by__in=salesref_users_id)
        serializer = serializers.DealerDetailsSerializer(dealers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
