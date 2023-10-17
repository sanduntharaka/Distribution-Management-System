from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails, InvoiceIntem, Item
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404

from userdetails.models import UserDetails


class FilterByDate(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        bill_status = request.data['status']
        sales_ref = request.data['sales_ref']

        filters = {}

        if bill_status != 'all':
            filters = {
                'status': bill_status
            }

        if sales_ref != '':
            filters['dis_sales_ref__sales_ref'] = sales_ref

        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor.id

            filters['added_by'] = UserDetails.objects.get(
                user=request.user.id).id

        else:
            distributor = request.data['distributor']

        filters['dis_sales_ref__distributor'] = distributor
        if by_date:
            filters['date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)
        serializer = serializers.InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FilterByCategory(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        category = int(request.data['category'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        bill_status = request.data['status']
        sales_ref = request.data['sales_ref']
        filters = {}
        if bill_status != 'all':
            filters = {
                'invoice_item__bill__status': bill_status
            }

        if sales_ref != '':
            filters['invoice_item__bill__dis_sales_ref__sales_ref'] = sales_ref

        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor.id
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=distributor, added_by__user=request.user.id)

        else:
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=request.data['distributor'])
        filters['invoice_item__bill__in'] = invoices
        if category != -1:
            filters['item__item__category'] = category
        if by_date:
            filters['invoice_item__bill__date__range'] = (date_from, date_to)

        items = Item.objects.filter(**filters)
        serializer = serializers.InvoiceItemSerializer(items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
#


class FilterByProduct(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        product = int(request.data['product'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        bill_status = request.data['status']
        sales_ref = request.data['sales_ref']
        filters = {}
        if bill_status != 'all':
            filters = {
                'invoice_item__bill__status': bill_status
            }
        if sales_ref != '':
            filters['invoice_item__bill__dis_sales_ref__sales_ref'] = sales_ref
        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor.id
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=distributor, added_by__user=request.user.id)

        else:
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=request.data['distributor'])
        filters['invoice_item__bill__in'] = invoices

        if product != -1:
            filters['item'] = product
        if by_date:
            filters['invoice_item__bill__date__range'] = (date_from, date_to)
        items = Item.objects.filter(**filters)
        serializer = serializers.InvoiceItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
