from exceutive_manager.models import ExecutiveManager
from userdetails.models import UserDetails
from rest_framework import status
from rest_framework.response import Response
from manager_distributor.models import ManagerDistributor
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateManagerDistributor(generics.CreateAPIView):
    serializer_class = serializers.CreateManagerDistributorsSerializer
    queryset = ManagerDistributor.objects.all()


class AllManagerDistributor(generics.ListAPIView):
    serializer_class = serializers.GetManagerDistributorsSerializer
    queryset = ManagerDistributor.objects.all()


class DeleteManagerDistributor(generics.DestroyAPIView):
    queryset = ManagerDistributor.objects.all()
    serializer_class = serializers.CreateManagerDistributorsSerializer


class AllManagerDistributorByManager(generics.ListAPIView):
    serializer_class = serializers.GetManagerDistributorsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        return get_list_or_404(ManagerDistributor, added_by=item)


class AllManagerDistributorByExecutive(generics.ListAPIView):
    serializer_class = serializers.GetManagerDistributorsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        managers = ExecutiveManager.objects.filter(
            executive=item).values('manager')
        manager_ids = [i['manager'] for i in managers]
        manager_users = UserDetails.objects.filter(
            id__in=manager_ids).values('user')
        manager_users_ids = [i['user'] for i in manager_users]
        return get_list_or_404(ManagerDistributor, added_by__in=manager_users_ids)
