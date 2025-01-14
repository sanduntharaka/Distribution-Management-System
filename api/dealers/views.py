from django.db.models import Case, When, Value, IntegerField
from primary_sales_area.models import PrimarySalesArea
from distrubutor_salesref_invoice.models import SalesRefInvoice
from rest_framework_simplejwt.backends import TokenBackend
from executive_distributor.models import ExecutiveDistributor
from exceutive_manager.models import ExecutiveManager
from manager_distributor.models import ManagerDistributor
from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from userdetails.models import UserDetails
from dealer_details.models import Dealer, DealerOrder
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_list_or_404
import pandas as pd
import json


class AddDealer(generics.CreateAPIView):
    serializer_class = serializers.AddDealerSerializer
    queryset = Dealer.objects.all()


class AddDealerExcel(APIView):
    def post(self, request):
        try:
            data_file = request.data['file']
            user = request.data['user']
            df = pd.read_excel(data_file)
            thisisjson = json.loads(df.to_json(orient='records'))
            for i in thisisjson:
                i['added_by'] = user

            serializer = serializers.AddDealerSerializer(
                data=thisisjson, many=True)

            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetAll(generics.ListAPIView):
    serializer_class = serializers.GetAllDealersSerializer
    # queryset = Dealer.objects.all()
    pagination_class = None

    def get_queryset(self):
        user = self.request.user.id
        users = []
        if (self.request.user.is_company):

            return get_list_or_404(Dealer)

        if (self.request.user.is_excecutive):
            manager = ExecutiveManager.objects.get(
                executive__user=user).manager.id
            users.append(manager)
            distributors = ExecutiveDistributor.objects.filter(
                executive__user=user).values_list('distributor', flat=True)
            distributors_ids = UserDetails.objects.filter(
                id__in=distributors).values_list('user', flat=True)
            users.extend(distributors_ids)
            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__user__in=distributors_ids).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs_ids).values_list('user', flat=True)

            users.extend(salesref_users_ids)
        if (self.request.user.is_manager):
            users.append(user)

            distributors = ManagerDistributor.objects.filter(
                manager__user=user).values_list('distributor', flat=True)
            distributors_ids = UserDetails.objects.filter(
                id__in=distributors).values_list('user', flat=True)
            users.extend(distributors_ids)
            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__user__in=distributors_ids).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs_ids).values_list('user', flat=True)

            users.extend(salesref_users_ids)
        if (self.request.user.is_distributor):
            users.append(user)
            manager = ManagerDistributor.objects.get(
                distributor__user=user).manager.user.id
            users.append(manager)
            salesrefs = SalesRefDistributor.objects.filter(
                distributor__user=user).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs).values_list('user', flat=True)
            users.extend(salesref_users_ids)

        if (self.request.user.is_salesref):

            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=user).distributor.user.id
            users.append(distributor)
            manager = ManagerDistributor.objects.get(
                distributor__user=distributor).manager.user.id
            users.append(manager)

            salesrefs = SalesRefDistributor.objects.filter(
                distributor__user=distributor).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs).values_list('user', flat=True)
            users.extend(salesref_users_ids)

        return get_list_or_404(Dealer, added_by__in=users)


class GradeFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        grade = request.query_params.get('grade')
        if grade:
            return queryset.filter(grade=grade)
        return queryset


class GetAllSearch(generics.ListAPIView):
    serializer_class = serializers.GetAllDealersSerializer
    # queryset = Dealer.objects.all()
    filter_backends = [GradeFilterBackend, filters.SearchFilter]
    search_fields = ('name', 'address', 'grade')
    pagination_class = None

    def get_queryset(self):
        user = self.request.user.id
        users = []
        if (self.request.user.is_company):

            return Dealer.objects.all()

        if (self.request.user.is_excecutive):
            manager = ExecutiveManager.objects.get(
                executive__user=user).manager.id
        if (self.request.user.is_manager):
            users.append(user)

            distributors = ManagerDistributor.objects.filter(
                manager__user=user).values_list('distributor', flat=True)
            distributors_ids = UserDetails.objects.filter(
                id__in=distributors).values_list('user', flat=True)
            users.extend(distributors_ids)
            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__user__in=distributors_ids).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs_ids).values_list('user', flat=True)

            users.extend(salesref_users_ids)
        if (self.request.user.is_distributor):
            users.append(user)
            manager = ManagerDistributor.objects.get(
                distributor__user=user).manager.user.id
            users.append(manager)
            salesrefs = SalesRefDistributor.objects.filter(
                distributor__user=user).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs).values_list('user', flat=True)
            users.extend(salesref_users_ids)

        if (self.request.user.is_salesref):
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=user).distributor.user.id
            users.append(distributor)
            manager = ManagerDistributor.objects.get(
                distributor__user=distributor).manager.user.id
            users.append(manager)
            salesrefs = SalesRefDistributor.objects.filter(
                distributor__user=distributor).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs).values_list('user', flat=True)
            users.extend(salesref_users_ids)

        return Dealer.objects.filter(added_by__in=users)


class DeleteDealer(generics.DestroyAPIView):
    serializer_class = serializers.AddDealerSerializer
    queryset = Dealer.objects.all()


class EditDealerDetails(generics.UpdateAPIView):
    serializer_class = serializers.EditDealersSerializer
    queryset = Dealer.objects.all()

    def update(self, request, *args, **kwargs):
        if request.user.is_distributor or request.user.is_manager:
            return super().update(request, *args, **kwargs)
        else:
            return Response(data='user not allowed', status=status.HTTP_401_UNAUTHORIZED)


class GetAllByDistributor(generics.ListAPIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')
        salesrefs = SalesRefDistributor.objects.filter(
            distributor=item).values('sales_ref')
        salesrefs_ids = [salesref['sales_ref']
                         for salesref in salesrefs]
        salesref_list = UserDetails.objects.filter(
            id__in=salesrefs_ids).values('user')
        distributoruser = UserDetails.objects.get(
            id=item)
        salesref_users_id = [sf['user']
                             for sf in salesref_list]
        salesref_users_id.append(distributoruser.user.id)
        dealers = Dealer.objects.filter(
            added_by__in=salesref_users_id)
        serializer = serializers.GetAllDealersSerializer(dealers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllByPsa(generics.ListAPIView):
    serializer_class = serializers.GetAllDealersSerializer

    def get_queryset(self, *args, **kwargs):

        try:
            dearler_order = DealerOrder.objects.get(
                psa=self.kwargs.get('id')).dealers

            case_expression = Case(*[When(id=id_val, then=pos)
                                   for pos, id_val in enumerate(dearler_order)])
            queryset = Dealer.objects.filter(
                id__in=dearler_order).order_by(case_expression)
        except DealerOrder.DoesNotExist:
            queryset = Dealer.objects.filter(psa=self.kwargs.get('id'))

        return get_list_or_404(queryset)


class ShowCredits(generics.ListAPIView):
    serializer_class = serializers.GetCreditInvoiceSerializer

    def get_queryset(self, **kwargs):
        dealer = self.kwargs.get('dealer')
        if self.request.user.is_distributor:
            user_id = self.request.user.id
            distributor = SalesRefDistributor.objects.filter(
                distributor__user=user_id).first().distributor.id

        if self.request.user.is_salesref:
            user_id = self.request.user.id
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=user_id).distributor.id
        queryset = SalesRefInvoice.objects.filter(
            dis_sales_ref__distributor=distributor, dealer=dealer, is_settiled=False, status='confirmed').order_by('date')
        return queryset


class CreateDealerOrder(APIView):
    # serializer_class = serializers.AddRouteSerializer

    def post(self, request, *args, **kwargs):
        request_data = request.data
        salesref = request_data['sales_rep']
        dealers = [i['id'] for i in request_data['dealers']]
        dealer_objects = Dealer.objects.filter(id__in=dealers)
        psas = [i.psa.id for i in dealer_objects]
        unique_psas = list(set(psas))

        try:
            previous_order = DealerOrder.objects.get(
                salesref=salesref, psa__id=unique_psas[0])

            previous_order.dealers = dealers
            previous_order.psa = PrimarySalesArea.objects.get(
                id=unique_psas[0])
            previous_order.save()
            return Response(status=status.HTTP_200_OK)

        except DealerOrder.DoesNotExist:
            serializer = serializers.AddDealerOrderSerializer(
                data={'salesref': salesref, 'dealers': dealers, 'psa': unique_psas[0]})
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
