from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from distrubutor_salesref_invoice.models import SalesRefInvoice
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class GetAllData(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        if request.user.is_salesref:
            salesrefs_distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id)
            filters = {
                'dis_sales_ref_id': salesrefs_distributor,
                'status': 'pending',
            }

        else:

            salesrefs_distributor = SalesRefDistributor.objects.filter(
                distributor=request.data['distributor'])

            filters = {
                'dis_sales_ref__in': salesrefs_distributor,
                'status': 'pending',
            }
        if by_date:
            filters['date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)

        serializer = serializers.PendingInvoiceSerializer(
            invoices, many=True)
        #
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetByManager(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        distributors = ManagerDistributor.objects.filter(
            manager_id=item).values('distributor')
        distributor_ids = [distributor['distributor']
                           for distributor in distributors]
        sales_refs = SalesRefDistributor.objects.filter(
            distributor_id__in=distributor_ids).values('sales_ref')
        sales_ref_ids = [salesref['sales_ref']
                         for salesref in sales_refs]
        salesref_list = UserDetails.objects.filter(
            id__in=sales_ref_ids).values('user')
        salesref_users_id = [sf['user']
                             for sf in salesref_list]

        filters = {
            'salesreturn__added_by_id__in': salesref_users_id,

        }
        if by_date:
            filters['salesreturn__date__range'] = (date_from, date_to)

        sales_returns_items = SalesRefInvoice.objects.filter(**filters)
        serializer = serializers.SalesReturnItemsSerializer(
            sales_returns_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
