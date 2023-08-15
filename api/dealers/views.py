from rest_framework_simplejwt.backends import TokenBackend
from executive_distributor.models import ExecutiveDistributor
from exceutive_manager.models import ExecutiveManager
from manager_distributor.models import ManagerDistributor
from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from userdetails.models import UserDetails
from dealer_details.models import Dealer
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

    def get_queryset(self):
        user = self.request.user.id
        users = []
        if (self.request.user.is_company):

            return get_list_or_404(Dealer)

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
        return get_list_or_404(Dealer, psa=self.kwargs.get('id'))
