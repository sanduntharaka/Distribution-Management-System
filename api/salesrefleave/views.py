from userdetails.models import UserDetails
from executive_distributor.models import ExecutiveDistributor
from exceutive_manager.models import ExecutiveManager
from manager_distributor.models import ManagerDistributor
from rest_framework import status
from rest_framework.response import Response
from sales_ref_leave.models import SalesRefLeave
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from .SendEmail import SendEmail
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_list_or_404, get_object_or_404


class AddLeave(generics.CreateAPIView):
    queryset = SalesRefLeave.objects.all()
    serializer_class = serializers.CreateLeaveSerializer


class AllByUserId(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(SalesRefLeave, salesref=item)


class AllByIdLeave(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self):
        user = self.request.user.id
        users = []
        if (self.request.user.is_company):

            return get_list_or_404(SalesRefLeave)

        if (self.request.user.is_excecutive):
            users.append(user)
            distributors = ExecutiveDistributor.objects.filter(
                executive__user=user).values_list('distributor', flat=True)
            distributors_ids = UserDetails.objects.filter(
                id__in=distributors).values_list('user', flat=True)
            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__user__in=distributors_ids).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs_ids).values_list('user', flat=True)

            users.extend(salesref_users_ids)
        if (self.request.user.is_manager):
            users.append(user)
            distributors = ManagerDistributor.objects.filter(
                manager__user=user).values_list('distributor', flat=True)
            executives = ExecutiveManager.objects.filter(
                manager__user=user).values_list('executive', flat=True)
            users.extend(executives)
            distributors_ids = UserDetails.objects.filter(
                id__in=distributors).values_list('user', flat=True)

            salesrefs_ids = SalesRefDistributor.objects.filter(
                distributor__user__in=distributors_ids).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs_ids).values_list('user', flat=True)

            users.extend(salesref_users_ids)

        if (self.request.user.is_distributor):
            salesrefs = SalesRefDistributor.objects.filter(
                distributor__user=user).values_list('sales_ref', flat=True)
            salesref_users_ids = UserDetails.objects.filter(
                id__in=salesrefs).values_list('user', flat=True)
            users.extend(salesref_users_ids)

        return get_list_or_404(SalesRefLeave, salesref__user__in=users)


class DeleteLeave(generics.DestroyAPIView):
    queryset = SalesRefLeave.objects.all()
    serializer_class = serializers.CreateLeaveSerializer


class ManagerLeaves(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self, *args, **kwargs):
        return get_list_or_404(SalesRefLeave, salesref__designation="Manager", approved=False)


class AllByManagerIdLeave(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        man_distris = ManagerDistributor.objects.filter(
            manager=item).values_list('distributor', flat=True)

        dis_sfs = SalesRefDistributor.objects.filter(
            distributor__in=man_distris).values_list('sales_ref', flat=True)
        executives = ExecutiveManager.objects.filter(
            manager=item).values_list('executive', flat=True)

        sales_refs = list(dis_sfs) + list(executives)

        return get_list_or_404(SalesRefLeave,
                               salesref__in=sales_refs, approved=False)


class ApproveByIdLeave(APIView):
    def put(self, request, *args, **kwargs):
        item = self.kwargs.get('id')

        leave = SalesRefLeave.objects.get(id=item)
        serializer = serializers.ApproveLeaveSerializer(
            data=request.data, instance=leave)

        try:
            if serializer.is_valid():
                serializer.save()
                email = SendEmail(id=item)
                email.send_email()
                return Response(status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
