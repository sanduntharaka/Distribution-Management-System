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


class AllByIdLeave(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(SalesRefLeave, salesref=item)


class DeleteLeave(generics.DestroyAPIView):
    queryset = SalesRefLeave.objects.all()
    serializer_class = serializers.CreateLeaveSerializer


class AllByDistributorIdLeave(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        dis_sfs = SalesRefDistributor.objects.filter(
            distributor=item).values('sales_ref')
        dis_sfs_ids = [i['sales_ref'] for i in dis_sfs]
        return get_list_or_404(SalesRefLeave, salesref__in=dis_sfs_ids)


class AllByManagerIdLeave(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        man_distris = ManagerDistributor.objects.filter(
            manager=item).values('distributor')
        distributor_ids = [i['distributor'] for i in man_distris]

        dis_sfs = SalesRefDistributor.objects.filter(
            distributor__in=distributor_ids).values('sales_ref')
        dis_sfs_ids = [i['sales_ref'] for i in dis_sfs]
        return get_list_or_404(SalesRefLeave, salesref__in=dis_sfs_ids, approved=False)


class ApproveByManagerIdLeave(APIView):
    def put(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        leave = SalesRefLeave.objects.get(id=item)
        serializer = serializers.ApproveLeaveSerializer(
            data=request.data, instance=leave)
        distributor_email = SalesRefDistributor.objects.get(
            sales_ref=leave.salesref).distributor.email

        try:
            if serializer.is_valid():
                serializer.save()
                email = SendEmail(id=item, supurvisor=distributor_email)
                email.send_email()
                return Response(status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
