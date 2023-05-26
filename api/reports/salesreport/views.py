from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails, InvoiceIntem
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class FilterByDateDistributor(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'dis_sales_ref__distributor': item,
        }
        if by_date:
            filters['date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)
        serializer = serializers.InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FilterByCategoryDistributor(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        category = int(request.data['category'])
        invoices = SalesRefInvoice.objects.filter(
            dis_sales_ref__distributor=item)
        filters = {
            'bill__in': invoices
        }
        if category != -1:
            filters['item__category'] = category
        items = InvoiceIntem.objects.filter(**filters)
        serializer = serializers.InvoiceItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
