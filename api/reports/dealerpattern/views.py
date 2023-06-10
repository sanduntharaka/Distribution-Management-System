from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails, ChequeDetails, InvoiceIntem
from dealer_details.models import Dealer
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class FilterPurchaseByDateDistributor(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'dis_sales_ref__distributor': item,
            'status': 'confirmed',
        }
        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(
            **filters).values('dealer').distinct()
        allinvoices = SalesRefInvoice.objects.filter(
            **filters)
        dealer_ids = [inv['dealer'] for inv in invoices]
        dealers = Dealer.objects.filter(id__in=dealer_ids)
        dealer_serializer = serializers.GetDealerSerializer(
            dealers, many=True)
        invoice_serializer = serializers.DealerInvoicesSerializer(
            allinvoices, many=True)

        data = {
            'dealers': dealer_serializer.data,
            'invoices': invoice_serializer.data,

        }
        return Response(data=data, status=status.HTTP_200_OK)
#


class GetPurchaseDataByDistributor(APIView):
    def post(self, request, *args, **kwargs):
        invoice = SalesRefInvoice.objects.get(id=request.data['invoice'])
        items = InvoiceIntem.objects.filter(bill=invoice)
        serializer = serializers.InvoiceItemSerializer(items, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class FilterPaymentByDateDistributor(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'bill__dis_sales_ref__distributor': item,
            'bill__status': 'confirmed',
        }
        if by_date:
            filters['date__range'] = (date_from, date_to)
        payments = PaymentDetails.objects.filter(**filters).values('bill')
        inv_ids = [pay['bill'] for pay in payments]
        invoices = SalesRefInvoice.objects.filter(
            id__in=inv_ids).values('dealer').distinct()
        dealer_ids = [inv['dealer'] for inv in invoices]
        dealers = Dealer.objects.filter(id__in=dealer_ids)
        dealer_serializer = serializers.GetDealerSerializer(
            dealers, many=True)

        data = {
            'dealers': dealer_serializer.data,
        }
        return Response(data=data, status=status.HTTP_200_OK)


class GetPaymentDataByDistributor(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'dis_sales_ref__distributor': item,

        }
        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(
            **filters).values('id')
        invoice_ids = [inv['id'] for inv in invoices]
        payments = PaymentDetails.objects.filter(bill__in=invoice_ids)
        serializer = serializers.InvoicePaymentSerializer(payments, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

# Invoice date
# Invoice Number
# Amount
# Payment Method
# settled date
# Period
