from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails, InvoiceIntem
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from userdetails.models import UserDetails


class FilterByDate(APIView):
    def post(self, request, *args, **kwargs):
        date_from = request.data['date_from']
        date_to = request.data['date_to']
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

        filters['status'] = 'confirmed'

        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)
        serializer = serializers.InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
