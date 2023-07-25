from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails, ChequeDetails
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from django.db.models import Sum

from datetime import date


class FilterByDate(APIView):
    def post(self, request, *args, **kwargs):

        date_from = request.data['date_from']
        date_to = request.data['date_to']
        salesref = int(request.data['salesref'])
        by_date = bool(date_from and date_to)
        filters = {
            'dis_sales_ref__distributor':  request.data['distributor'],
            'status': 'confirmed',
        }
        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        if salesref != -1:
            filters['added_by'] = salesref
        if salesref == 0:
            filters['added_by'] = request.data['distributor']
        invoices = SalesRefInvoice.objects.filter(**filters).values('id')

        invoices_ids = [invoice['id'] for invoice in invoices]
        payment_details = PaymentDetails.objects.filter(
            bill__in=invoices_ids)

        grouped_payment_details = list(payment_details.values(
            'date', 'payment_type').annotate(total_paid_amount=Sum('paid_amount')))
        # p = payment_details.annotate(total_paid_amount=Sum('paid_amount'))
        data = []
        duplicate_items = []
        date_details = {}

        for pd in grouped_payment_details:
            date = pd['date'].strftime('%Y-%m-%d')
            payment_type = pd['payment_type']
            paid_amount = pd['total_paid_amount']

            # If the date already exists in the dictionary, update the payment details
            if date in date_details:
                detail = date_details[date]
                if payment_type == 'cash':
                    detail['cash'] = detail.get('cash', 0) + paid_amount
                elif payment_type in ['cheque', 'cheque-credit', 'cash-credit-cheque']:
                    detail['cheque'] = detail.get('cheque', 0) + paid_amount
                elif payment_type in ['credit', 'cash-credit', 'cash-credit-cheque']:
                    detail['credit'] = detail.get('credit', 0) + paid_amount
            else:
                # If the date is encountered for the first time, create a new detail dictionary
                detail = {'date': date}
                if payment_type == 'cash':
                    detail['cash'] = paid_amount
                    detail['cheque'] = 0
                    detail['credit'] = 0

                elif payment_type == 'cheque':
                    detail['cheque'] = paid_amount
                    detail['cash'] = 0
                    detail['credit'] = 0
                elif payment_type in ['credit', 'cash-credit', 'cheque-credit', 'cash-credit-cheque']:
                    detail['credit'] = paid_amount
                    detail['cash'] = 0
                    detail['cheque'] = 0

                # Add the detail dictionary to the data list and the date_details dictionary
                data.append(detail)
                date_details[date] = detail
        # serializer = serializers.PyementDetailsSerializer(
        #     payment_details, many=True)
        return Response(data=data, status=status.HTTP_200_OK)

    # serializer.data,
[
    {
        'date': '2023-01-01',
        'count': 5
    },
    {
        'date': '2023-01-05',
        'count': 10
    },
    {
        'date': '2023-01-03',
        'count': 5
    },
    {
        'date': '2023-01-01',
        'count': 12
    },
]
