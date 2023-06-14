from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref.models import SalesRefDistributor
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class GetFocReport(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        # category = int(request.data['category'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        filters = {
            'dis_sales_ref__distributor': item,
        }

        if by_date:
            filters['date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)
        invoice_ids = [inv['id'] for inv in invoices.values('id')]
        items_filter = {
            'bill__in': invoice_ids,
        }
        data = {
            'territory': invoices.first().dis_sales_ref.distributor.terriotory,
            'distributor': invoices.first().dis_sales_ref.distributor.full_name,
        }
        items = InvoiceIntem.objects.filter(**items_filter)
        print(items)
        data['details'] = serializers.AddtionalFocSerializer(
            items, many=True).data
        return Response(data, status=status.HTTP_200_OK)
