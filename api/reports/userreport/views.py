from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class AllStaffDetails(generics.ListAPIView):
    serializer_class = serializers.AllStaffDetailsSerializer
    queryset = UserDetails.objects.all()


class AllStaffDetailsByManager(APIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')
        distributors = ManagerDistributor.objects.filter(
            manager_id=item).values('distributor')
        distributor_ids = [distributor['distributor']
                           for distributor in distributors]
        distributors_list = UserDetails.objects.filter(id__in=distributor_ids)

        sales_refs = SalesRefDistributor.objects.filter(
            distributor_id__in=distributor_ids).values('sales_ref')
        sales_ref_ids = [sales_ref['sales_ref'] for sales_ref in sales_refs]
        sales_refs_list = UserDetails.objects.filter(id__in=sales_ref_ids)

        serializer = serializers.AllStaffDetailsSerializer(
            list(distributors_list)+list(sales_refs_list), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class AllStaffDetailsByDistributor(APIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')

        sales_refs = SalesRefDistributor.objects.filter(
            distributor_id=item).values('sales_ref')
        sales_ref_ids = [sales_ref['sales_ref'] for sales_ref in sales_refs]
        sales_refs_list = UserDetails.objects.filter(id__in=sales_ref_ids)

        serializer = serializers.AllStaffDetailsSerializer(
            list(sales_refs_list), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
#
