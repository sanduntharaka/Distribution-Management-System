from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from distrubutor_salesref_invoice.models import SalesRefInvoice, ChequeDetails, PaymentDetails
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from datetime import date, timedelta

today = date.today()


class GetByDistributor(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        salesrefs_distributor = SalesRefDistributor.objects.filter(
            distributor=item)

        filters = {
            'bill__dis_sales_ref__in': salesrefs_distributor,
            'payment_type': 'cheque'
        }
        if by_date:
            filters['date__range'] = (date_from, date_to)
        invoices = PaymentDetails.objects.filter(**filters)
        cheque_details = ChequeDetails.objects.filter(
            payment_details__in=invoices, status='pending')
        serializer = serializers.ChequeDetailsSerializer(
            cheque_details, many=True)
        #
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetByDistributorPeriod(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        period = int(request.data['period'])
        salesrefs_distributor = SalesRefDistributor.objects.filter(
            distributor=item)
        if period == 7:
            range_start = today - timedelta(days=150)
            range_end = today - timedelta(days=121)
            invoices = SalesRefInvoice.objects.filter(
                date__lt=range_end, dis_sales_ref__in=salesrefs_distributor)
            cheque_details = ChequeDetails.objects.filter(
                bill__in=invoices, status='pending')
            serializer = serializers.ChequeDetailsSerializer(
                cheque_details, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        days_mapping = {
            0: (14, 0),
            1: (30, 15),
            2: (45, 31),
            3: (60, 46),
            4: (90, 61),
            5: (120, 91),
            6: (150, 121)
        }

        range_start = today - timedelta(days=days_mapping[period][0])
        range_end = today - timedelta(days=days_mapping[period][1])

        filters = {
            'bill__dis_sales_ref__in': salesrefs_distributor,
            'date__range': (range_start, range_end),
            'payment_type': 'cheque'
        }

        invoices = PaymentDetails.objects.filter(**filters)
        cheque_details = ChequeDetails.objects.filter(
            payment_details__in=invoices, status='pending')
        serializer = serializers.ChequeDetailsSerializer(
            cheque_details, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ReturnsGetByDistributorPeriod(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        period = int(request.data['period'])
        salesrefs_distributor = SalesRefDistributor.objects.filter(
            distributor=item)
        if period == 7:
            range_start = today - timedelta(days=150)
            range_end = today - timedelta(days=121)
            invoices = SalesRefInvoice.objects.filter(
                date__lt=range_end, dis_sales_ref__in=salesrefs_distributor)
            cheque_details = ChequeDetails.objects.filter(
                payment_details__bill__in=invoices, status='return')
            serializer = serializers.ReturnChequeDetailsSerializer(
                cheque_details, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        days_mapping = {
            0: (14, 0),
            1: (30, 15),
            2: (45, 31),
            3: (60, 46),
            4: (90, 61),
            5: (120, 91),
            6: (150, 121)
        }

        range_start = today - timedelta(days=days_mapping[period][0])
        range_end = today - timedelta(days=days_mapping[period][1])

        filters = {
            'bill__dis_sales_ref__in': salesrefs_distributor,
            'date__range': (range_start, range_end),
            'payment_type': 'cheque'
        }

        invoices = PaymentDetails.objects.filter(**filters)

        cheque_details = ChequeDetails.objects.filter(
            payment_details__in=invoices, status='return')
        serializer = serializers.ReturnChequeDetailsSerializer(
            cheque_details, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

#
# class GetByManager(APIView):
#     def post(self, request, *args, **kwargs):
#         item = self.kwargs.get('id')
#         date_from = request.data['date_from']
#         date_to = request.data['date_to']
#         by_date = bool(date_from and date_to)

#         distributors = ManagerDistributor.objects.filter(
#             manager_id=item).values('distributor')
#         distributor_ids = [distributor['distributor']
#                            for distributor in distributors]
#         sales_refs = SalesRefDistributor.objects.filter(
#             distributor_id__in=distributor_ids).values('sales_ref')
#         sales_ref_ids = [salesref['sales_ref']
#                          for salesref in sales_refs]
#         salesref_list = UserDetails.objects.filter(
#             id__in=sales_ref_ids).values('user')
#         salesref_users_id = [sf['user']
#                              for sf in salesref_list]

#         filters = {
#             'salesreturn__added_by_id__in': salesref_users_id,

#         }
#         if by_date:
#             filters['salesreturn__date__range'] = (date_from, date_to)

#         sales_returns_items = SalesRefInvoice.objects.filter(**filters)
#         serializer = serializers.SalesReturnItemsSerializer(
#             sales_returns_items, many=True)

#         return Response(serializer.data, status=status.HTTP_200_OK)
