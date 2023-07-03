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
        print(request.user.id)
        item = self.kwargs.get('id')
        category = int(request.data['category'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        filters = {
            'dis_sales_ref__distributor': item,
        }

        if by_date:
            filters['date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters).values('id')
        invoice_ids = [inv['id'] for inv in invoices]
        items_filter = {
            'bill__in': invoice_ids,
        }
        if category != -1:
            items_filter['item__item__category'] = category

        items = InvoiceIntem.objects.filter(**items_filter)

        serializer = serializers.FocSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
#
