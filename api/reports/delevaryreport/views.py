from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails, InvoiceIntem
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class FilterByDate(APIView):
    def post(self, request, *args, **kwargs):
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'dis_sales_ref__distributor': request.data['distributor'],
            'status': 'confirmed',
        }
        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)
        serializer = serializers.InvoiceSerializer(invoices, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FilterByCategory(APIView):
    def post(self, request, *args, **kwargs):
        category = int(request.data['category'])
        description = int(request.data['item'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        invoices = SalesRefInvoice.objects.filter(
            dis_sales_ref__distributor=request.data['distributor'], status='confirmed')

        filters = {
            'bill__in': invoices,

        }
        if category != -1:
            filters['item__item__category'] = category
        if description != -1:
            filters['item__item__id'] = description
        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        items = InvoiceIntem.objects.filter(**filters)
        serializer = serializers.InvoiceItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
