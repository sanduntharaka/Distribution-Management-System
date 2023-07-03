from rest_framework import status
from rest_framework.response import Response
from exceutive_manager.models import ExecutiveManager
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateManagerExecutive(generics.CreateAPIView):
    serializer_class = serializers.CreateExecutiveManagerSerializer
    queryset = ExecutiveManager.objects.all()


class AllManagerExecutive(generics.ListAPIView):
    serializer_class = serializers.GetExecutiveManagerSerializer
    queryset = ExecutiveManager.objects.all()


class DeleteManagerExecutive(generics.DestroyAPIView):
    queryset = ExecutiveManager.objects.all()
    serializer_class = serializers.CreateExecutiveManagerSerializer


class AllExecutiveManagerByExecutive(generics.ListAPIView):
    serializer_class = serializers.GetExecutiveManagerSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        return get_list_or_404(ExecutiveManager, executive__user=item)
