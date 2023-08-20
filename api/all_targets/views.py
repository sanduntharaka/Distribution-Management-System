from rest_framework_simplejwt.backends import TokenBackend
from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_list_or_404, get_object_or_404
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from targets.models import DistributorTargets, SalesrefTargets


class AddDistributorTargets(generics.CreateAPIView):
    serializer_class = serializers.AddDistributorTargetsSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        manager_distributor = ManagerDistributor.objects.get(
            distributor=data['distributor'])
        data['manager_distributor'] = manager_distributor.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ViewDistributorTargets(generics.ListAPIView):
    serializer_class = serializers.ShowDistributorTargetsSerializer
    queryset = DistributorTargets.objects.all()


class EditDistributorTargets(generics.UpdateAPIView):
    serializer_class = serializers.EditDistributorTargetsSerializer
    queryset = DistributorTargets.objects.all()


class DeleteDistributorTargets(generics.UpdateAPIView):
    serializer_class = serializers.AddDistributorTargetsSerializer
    queryset = DistributorTargets.objects.all()


class AddSalesrepTargets(generics.CreateAPIView):
    serializer_class = serializers.AddSalesrepTargetsSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        data = request.data
        salesrep_distributor = SalesRefDistributor.objects.get(
            sales_ref=data['salesrep'])
        data['salesrep_distributor'] = salesrep_distributor.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ViewSalesrepTargets(generics.ListAPIView):
    serializer_class = serializers.ShowSalesrepTargetsSerializer
    queryset = SalesrefTargets.objects.all()


class EditSalesrepTargets(generics.UpdateAPIView):
    serializer_class = serializers.EditSalesrepTargetsSerializer
    queryset = SalesrefTargets.objects.all()


class DeleteSalesrepTargets(generics.UpdateAPIView):
    serializer_class = serializers.AddSalesrepTargetsSerializer()
    queryset = SalesrefTargets.objects.all()
