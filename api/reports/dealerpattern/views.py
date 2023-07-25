from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails, ChequeDetails, InvoiceIntem
from dealer_details.models import Dealer
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from userdetails.models import UserDetails


class FilterPurchaseByDate(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor
            filters = {
                'dis_sales_ref__distributor': distributor,
                'status': 'confirmed',
                'added_by': UserDetails.objects.get(user=request.user.id)
            }

        else:

            filters = {
                'dis_sales_ref__distributor': request.data['distributor'],
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


class FilterPaymentByDate(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor
            filters = {
                'bill__dis_sales_ref__distributor': distributor,
                'bill__status': 'confirmed',
                'bill__added_by': UserDetails.objects.get(user=request.user.id)
            }

        else:

            filters = {
                'bill__dis_sales_ref__distributor': request.data['distributor'],
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
        item = self.kwargs.get('id')
        dealer = request.data['dealer']
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor
            filters = {
                'dis_sales_ref__distributor': distributor,
                'status': 'confirmed',
                'added_by': UserDetails.objects.get(user=request.user.id),
                'dealer': dealer,
            }

        else:

            filters = {
                'dis_sales_ref__distributor': request.data['distributor'],
                'status': 'confirmed',
                'dealer': dealer,
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
