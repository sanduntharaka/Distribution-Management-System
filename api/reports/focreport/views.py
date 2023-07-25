from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref.models import SalesRefDistributor
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from userdetails.models import UserDetails


class GetFocReport(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        category = int(request.data['category'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        description = int(request.data['item'])
        by_date = bool(date_from and date_to)

        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor
            filters = {
                'dis_sales_ref__distributor': distributor,
                'added_by': UserDetails.objects.get(user=request.user.id)
            }

        else:

            filters = {
                'dis_sales_ref__distributor': request.data['distributor'],
            }

        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters).values('id')
        invoice_ids = [inv['id'] for inv in invoices]
        items_filter = {
            'bill__in': invoice_ids,
        }
        if category != -1:
            items_filter['item__item__category'] = category
        if description != -1:
            items_filter['item__item__id'] = description
        items = InvoiceIntem.objects.filter(**items_filter)
        serializer = serializers.FocSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
#
