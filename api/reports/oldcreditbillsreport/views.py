from rest_framework import status
from rest_framework.response import Response
from past_invoice_data.models import PastCheque, PastInvoice
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class FilterByDateInvoice(APIView):
    def post(self, request, *args, **kwargs):
        try:
            date_from = request.data['date_from']
            date_to = request.data['date_to']
            by_date = bool(date_from and date_to)
            filters = {
                'distributor': request.data['distributor'],
            }

            if by_date:
                filters['date__range'] = (date_from, date_to)

            past_invoices = PastInvoice.objects.filter(**filters)

            serializer_inv = serializers.PastInvoiceSerializer(
                past_invoices, many=True)
            return Response(serializer_inv.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FilterByDaterCheque(APIView):
    def post(self, request, *args, **kwargs):
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'distributor': request.data['distributor'],
        }

        if by_date:
            filters['date__range'] = (date_from, date_to)

        past_cheques = PastCheque.objects.filter(**filters)
        serializer_cheque = serializers.PastChequeSerializer(
            past_cheques, many=True)
        return Response(serializer_cheque.data, status=status.HTTP_200_OK)
