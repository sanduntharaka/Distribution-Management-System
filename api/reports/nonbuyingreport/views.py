from django.utils import timezone
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from not_buy_details.models import NotBuyDetails
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from datetime import date, timedelta, datetime

today = date.today()


class GetByData(APIView):
    def post(self, request, *args, **kwargs):
        #
        # if request.data['date_from'] != '' and request.data['date_to'] != '':
        date_from = request.data['date_from']
        # timezone.make_aware(datetime.strptime(
        # request.data['date_from'], "%Y-%m-%d"))
        date_to = request.data['date_to']
        # timezone.make_aware(datetime.strptime(
        #     request.data['date_to'], "%Y-%m-%d"))
        by_date = bool(date_from and date_to)

        if request.user.is_salesref:
            filters = {
                'added_by_id': request.user.id,
            }
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor

        else:

            salesrefs = SalesRefDistributor.objects.filter(
                distributor=request.data['distributor']).values_list('sales_ref', flat=True)
            user_ids = UserDetails.objects.filter(
                id__in=salesrefs).values_list('user', flat=True)
            distributor = UserDetails.objects.get(
                id=request.data['distributor'])
            filters = {
                'added_by__in': user_ids,
            }

        if by_date:
            filters['datetime__range'] = (date_from, date_to)

        not_buy = NotBuyDetails.objects.filter(**filters)
        data = {
            'terriotory': distributor.getTerrotories(),
            'Distributor': distributor.full_name
        }
        serializer = serializers.NonBuyDetailsSerializer(not_buy, many=True)
        data['details'] = serializer.data
        print(data)
        return Response(data, status=status.HTTP_200_OK)


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
