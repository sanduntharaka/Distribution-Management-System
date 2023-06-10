from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice
from manager_distributor.models import ManagerDistributor
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
        }
        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)

        invoices = SalesRefInvoice.objects.filter(**filters)
        test_invoice = invoices.first()
        serializer = serializers.NormalPsaSerializer(invoices, many=True)
        data = {
            'terriotory': test_invoice.dis_sales_ref.distributor.terriotory,
            'distributor': test_invoice.dis_sales_ref.distributor.full_name,
            'manager': ManagerDistributor.objects.filter(distributor=test_invoice.dis_sales_ref.distributor).first().manager.full_name,
            'details': serializer.data
        }

        return Response(data=data, status=status.HTTP_200_OK)
