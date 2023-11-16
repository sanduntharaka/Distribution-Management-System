from reportclasses.market_return_report import GenerateMarketReturnExcell
from collections import defaultdict
from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from salesref_return.models import SalesRefReturn, SalesRefReturnItem
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor

from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class GetData(APIView):
    def post(self, request, *args, **kwargs):
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        filter_status = int(request.data['filter_status'])
        if request.user.is_salesref:
            sales_ref = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).sales_ref.user.id
            filters = {
                'salesrefreturn__added_by_id': sales_ref,

            }

        else:
            sales_refs = SalesRefDistributor.objects.filter(
                distributor_id=request.data['distributor']).values('sales_ref')

            sales_ref_ids = [salesref['sales_ref']
                             for salesref in sales_refs]
            salesref_list = UserDetails.objects.filter(
                id__in=sales_ref_ids).values('user')
            salesref_users_id = [sf['user']
                                 for sf in salesref_list]

            filters = {
                'salesrefreturn__added_by_id__in': salesref_users_id,

            }
        if by_date:
            filters['salesrefreturn__date__range'] = (date_from, date_to)
        if filter_status == 1:
            filters['salesrefreturn__status'] = 'pending'
        elif filter_status == 2:
            filters['salesrefreturn__status'] = 'approved'
        elif filter_status == 3:
            filters['salesrefreturn__status'] = 'rejected'

        sales_returns_items = SalesRefReturnItem.objects.filter(**filters)
        serializer = serializers.SalesReturnItemsSerializer(
            sales_returns_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetByManager(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        print(request.data)
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        status = int(request.data['status'])
        by_date = bool(date_from and date_to)
        sales_refs = SalesRefDistributor.objects.filter(
            distributor=item).values('sales_ref')
        sales_ref_ids = [salesref['sales_ref']
                         for salesref in sales_refs]
        salesref_list = UserDetails.objects.filter(
            id__in=sales_ref_ids).values('user')
        salesref_users_id = [sf['user']
                             for sf in salesref_list]

        filters = {
            'salesrefreturn__added_by_id__in': salesref_users_id,


        }
        if by_date:
            filters['salesrefreturn__date__range'] = (date_from, date_to)
        if status == 1:
            filters['status'] = 'pending'
        elif status == 2:
            filters['status'] = 'approved'
        elif status == 3:
            filters['status'] = 'rejected'

        sales_returns_items = SalesRefReturnItem.objects.filter(**filters)
        serializer = serializers.SalesReturnItemsSerializer(
            sales_returns_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetDataByDate(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)

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
            filters['date__range'] = (date_from, date_to)
        try:
            market_returns = SalesRefReturn.objects.filter(
                **filters).values('id')

            invoice_ids = [inv['id'] for inv in market_returns]
            items_filter = {
                'salesrefreturn__in': invoice_ids,
            }

            items = SalesRefReturnItem.objects.filter(**items_filter)
            main_details['month'] = items.first(
            ).salesrefreturn.date.strftime("%B")

            data = {'main_details': main_details}
            foc_with_category = []
            for i in items:
                details = {}
                details['category'] = i.item_category()
                details['qty'] = i.foc+i.qty
                details['invoice'] = i.salesrefreturn.bill_code + \
                    str(i.salesrefreturn.bill_number)
                details['date'] = i.salesrefreturn.date
                foc_with_category.append(details)

            grouped_data = defaultdict(list)

            for item in foc_with_category:
                key = (item['category'], item['invoice'], item['date'])
                grouped_data[key].append(item)

            result = [grouped_items[-1]
                      for grouped_items in grouped_data.values()]

            data['category_details'] = result

            file_genearte = GenerateMarketReturnExcell(data)

            return file_genearte.generate()
        except Exception as e:
            if len(market_returns) == 0:
                return Response({"data": "Invoices not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"data": e}, status=status.HTTP_400_BAD_REQUEST)
