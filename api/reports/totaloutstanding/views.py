from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails, ChequeDetails
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class FilterByDateDistributor(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filters = {
            'dis_sales_ref__distributor': item,
            'status': 'confirmed',
            'is_settiled': False,
        }
        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)

        serializer = serializers.OutstandingSerializer(
            invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Invoice number
# Invoice date
# Original amount
# balance amount
# due date
