from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from userdetails.models import UserDetails
from executive_distributor.models import ExecutiveDistributor
from exceutive_manager.models import ExecutiveManager
from rest_framework import filters
from rest_framework import status
from rest_framework.response import Response
from primary_sales_area.models import PrimarySalesArea
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404
from tablib import Dataset
import pandas as pd
from rest_framework.views import APIView


class CreatePSA(generics.CreateAPIView):
    serializer_class = serializers.CreatePSASerializer
    queryset = PrimarySalesArea.objects.all()


class CreateFromExcell(APIView):
    def row_generator(self, dataset, user):
        i = 1
        for row in dataset:

            category = {
                'area_name': row[0],
                'more_details': row[1],
                'created_by': user,

            }

            yield category, i
            i += 1

    def post(self, request):

        user_account = request.data['user']
        data_file = request.data['file']
        df = pd.read_excel(data_file)
        dataset = Dataset().load(df)
        erros_reson = []
        erros = []
        success = []
        for category, i in self.row_generator(dataset=dataset, user=user_account):

            serializer = serializers.CreatePSASerializer(data=category)
            if serializer.is_valid():
                serializer.save()
                success.append(i)
            else:
                erros.append(i)
                erros_reson.append(serializer.errors)

        if len(erros) > 0 and len(success) < 1:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors': erros, 'resons': erros_reson}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors_count': len(erros), 'error_rows': erros, 'resons': erros_reson}, status=status.HTTP_201_CREATED)


class AllCreatedPsa(generics.ListAPIView):
    serializer_class = serializers.GetAllPSASerializer

    def get_queryset(self):
        user = self.request.user.id
        users = []

        show = {}
        if (self.request.user.is_company):

            return get_list_or_404(PrimarySalesArea)

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

            show['created_by__in'] = users
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
            show['created_by__in'] = users
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
            show['created_by__in'] = users

        if (self.request.user.is_salesref):

            # distributor = SalesRefDistributor.objects.get(
            #     sales_ref__user=user).distributor.user.id
            # users.append(distributor)
            # manager = ManagerDistributor.objects.get(
            #     distributor__user=distributor).manager.user.id
            # users.append(manager)

            # salesrefs = SalesRefDistributor.objects.filter(
            #     distributor__user=distributor).values_list('sales_ref', flat=True)
            # salesref_users_ids = UserDetails.objects.filter(
            #     id__in=salesrefs).values_list('user', flat=True)
            # users.extend(salesref_users_ids)
            show['sales_ref__user'] = self.request.user

        return get_list_or_404(PrimarySalesArea, **show)


class GetAllSearch(generics.ListAPIView):
    serializer_class = serializers.GetAllPSASerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ('area_name',)

    def get_queryset(self):
        user = self.request.user.id
        users = []

        show = {}
        if (self.request.user.is_company):

            return get_list_or_404(PrimarySalesArea)

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
            show['created_by__in'] = users
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
            show['created_by__in'] = users

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
            show['created_by__in'] = users

        if (self.request.user.is_salesref):

            # distributor = SalesRefDistributor.objects.get(
            #     sales_ref__user=user).distributor.user.id
            # users.append(distributor)
            # manager = ManagerDistributor.objects.get(
            #     distributor__user=distributor).manager.user.id
            # users.append(manager)

            # salesrefs = SalesRefDistributor.objects.filter(
            #     distributor__user=distributor).values_list('sales_ref', flat=True)
            # salesref_users_ids = UserDetails.objects.filter(
            #     id__in=salesrefs).values_list('user', flat=True)
            # users.extend(salesref_users_ids)
            show['sales_ref__user'] = self.request.user

        return PrimarySalesArea.objects.filter(**show)


class EditPsa(generics.UpdateAPIView):
    serializer_class = serializers.EditPsaSerializer
    queryset = PrimarySalesArea.objects.all()


class DeletePsa(generics.DestroyAPIView):
    serializer_class = serializers.CreatePSASerializer
    queryset = PrimarySalesArea.objects.all()
