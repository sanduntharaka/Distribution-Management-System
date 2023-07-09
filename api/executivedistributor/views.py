from exceutive_manager.models import ExecutiveManager
from rest_framework import status
from rest_framework.response import Response
from executive_distributor.models import ExecutiveDistributor
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateExecutiveDistributor(generics.CreateAPIView):
    serializer_class = serializers.CreateExecutiveDistributorSerializer
    queryset = ExecutiveDistributor.objects.all()


class AllDistributorExecutive(generics.ListAPIView):
    serializer_class = serializers.GetExecutiveDistributorSerializer
    queryset = ExecutiveDistributor.objects.all()


class DeleteDistributorExecutive(generics.DestroyAPIView):
    queryset = ExecutiveDistributor.objects.all()
    serializer_class = serializers.CreateExecutiveDistributorSerializer


class AllExecutiveDistributorByManager(generics.ListAPIView):
    serializer_class = serializers.GetExecutiveDistributorSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        executives = ExecutiveManager.objects.filter(
            manager=item).values_list('executive', flat=True)
        return get_list_or_404(ExecutiveDistributor, executive__in=executives)
