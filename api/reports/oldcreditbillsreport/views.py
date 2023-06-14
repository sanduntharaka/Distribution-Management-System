from rest_framework import status
from rest_framework.response import Response
from past_invoice_data.models import PastCheque, PastInvoice
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class FilterByDateDistributorInvoice(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'distributor': item,
        }

        if by_date:
            filters['date__range'] = (date_from, date_to)

        past_invoices = PastInvoice.objects.filter(**filters)

        serializer_inv = serializers.PastInvoiceSerializer(
            past_invoices, many=True)
        return Response(serializer_inv.data, status=status.HTTP_200_OK)


class FilterByDateDistributorCheque(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'distributor': item,
        }

        if by_date:
            filters['date__range'] = (date_from, date_to)

        past_cheques = PastCheque.objects.filter(**filters)
        serializer_cheque = serializers.PastChequeSerializer(
            past_cheques, many=True)
        return Response(serializer_cheque.data, status=status.HTTP_200_OK)
