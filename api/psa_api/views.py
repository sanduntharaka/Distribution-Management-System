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


class CreatePSA(generics.CreateAPIView):
    serializer_class = serializers.CreatePSASerializer
    queryset = PrimarySalesArea.objects.all()


class AllCreatedPsa(generics.ListAPIView):
    serializer_class = serializers.GetAllPSASerializer

    def get_queryset(self):
        user = self.request.user.id
        users = []
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

        return get_list_or_404(PrimarySalesArea, created_by__in=users)


class GetAllSearch(generics.ListAPIView):
    serializer_class = serializers.GetAllPSASerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ('area_name',)

    def get_queryset(self):
        user = self.request.user.id
        users = []
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

        return PrimarySalesArea.objects.filter(created_by__in=users)


class EditPsa(generics.UpdateAPIView):
    serializer_class = serializers.EditPsaSerializer
    queryset = PrimarySalesArea.objects.all()


class DeletePsa(generics.DestroyAPIView):
    serializer_class = serializers.CreatePSASerializer
    queryset = PrimarySalesArea.objects.all()
