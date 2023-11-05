from collections import defaultdict
from datetime import date
from reportclasses.foc_report import GenerateFocExcell
from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref.models import SalesRefDistributor
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem, Item
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
            'invoice_item__bill__in': invoice_ids,
        }
        if category != -1:
            items_filter['item__item__category'] = category
        if description != -1:
            items_filter['item__item__id'] = description
        items = Item.objects.filter(**items_filter)
        serializer = serializers.FocSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


#


class GetFreeIssuesReport(APIView):
    def post(self, request, *args, **kwargs):

        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        main_details = {
            'distributor': SalesRefDistributor.objects.get(
                sales_ref=request.data['sales_ref']).distributor.full_name,
            'area': SalesRefDistributor.objects.get(
                sales_ref=request.data['sales_ref']).sales_ref.getTerrotories(),
            'sales_rep': SalesRefDistributor.objects.get(
                sales_ref=request.data['sales_ref']).sales_ref.full_name,
            'sales_rep_id': SalesRefDistributor.objects.get(
                sales_ref=request.data['sales_ref']).sales_ref.nic,
        }

        filters = {
            'dis_sales_ref__distributor': request.data['distributor'],
            'added_by': request.data['sales_ref'],
        }

        if by_date:
            filters['confirmed_date__range'] = (date_from, date_to)
        try:
            invoices = SalesRefInvoice.objects.filter(**filters).values('id')
            invoice_ids = [inv['id'] for inv in invoices]
            items_filter = {
                'bill__in': invoice_ids,
            }

            items = InvoiceIntem.objects.filter(**items_filter)

            main_details['month'] = items.first().bill.date.strftime("%B")

            data = {'main_details': main_details}
            foc_with_category = []
            for i in items:
                details = {}
                details['category'] = i.item_category()
                details['foc'] = i.foc
                details['invoice'] = i.bill.bill_code+str(i.bill.bill_number)
                details['date'] = i.bill.date
                foc_with_category.append(details)

            grouped_data = defaultdict(list)

            for item in foc_with_category:
                key = (item['category'], item['invoice'], item['date'])
                grouped_data[key].append(item)

            result = [grouped_items[-1]
                      for grouped_items in grouped_data.values()]

            data['category_details'] = result

            file_genearte = GenerateFocExcell(data)

            return file_genearte.generate()
        except Exception as e:

            if len(invoices) == 0:
                return Response({"data": "Invoices not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"data": e}, status=status.HTTP_400_BAD_REQUEST)
