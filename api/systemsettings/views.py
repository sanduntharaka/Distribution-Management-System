from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from system_settings.models import SystemSettings
from rest_framework.views import APIView
from users.models import UserAccount
from . import serializers
from django.shortcuts import get_object_or_404, get_list_or_404
from distrubutor_salesref.models import SalesRefDistributor


class CreateSettingsDetails(generics.CreateAPIView):
    queryset = SystemSettings.objects.all()
    serializer_class = serializers.SystemSettingsSerializer


class GetSettingsDetails(generics.RetrieveAPIView):
    queryset = SystemSettings.objects.all()
    serializer_class = serializers.SystemSettingsSerializer

    def get_queryset(self):
        return super().get_queryset().filter(id=1)


class GetVatRate(APIView):
    def get(self, request):
        vat_rate = get_object_or_404(SystemSettings, id=1)
        data = {
            'vat_percentage': vat_rate.vat_percentage
        }
        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user)
        if request.user.is_distributor:
            distributor = SalesRefDistributor.objects.filter(
                distributor__user=request.user).first()

        data['vat_no'] = distributor.distributor.vat_no
        # serializer = serializers.VatRateSerializer(vat_rate)
        return Response(data, status=status.HTTP_200_OK)


class GetVatRateByDistributorSrep(APIView):
    def get(self, request, id):

        distributor = SalesRefDistributor.objects.get(id=id).distributor
        vat_rate = get_object_or_404(SystemSettings, id=1)
        data = {
            'vat_percentage': vat_rate.vat_percentage
        }
        data['vat_no'] = distributor.vat_no
        # serializer = serializers.VatRateSerializer(vat_rate)
        return Response(data, status=status.HTTP_200_OK)
