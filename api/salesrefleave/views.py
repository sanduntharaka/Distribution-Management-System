from rest_framework import status
from rest_framework.response import Response
from sales_ref_leave.models import SalesRefLeave
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404, get_object_or_404


class AddLeave(generics.CreateAPIView):
    queryset = SalesRefLeave.objects.all()
    serializer_class = serializers.CreateLeaveSerializer


class AllByIdLeave(generics.ListAPIView):
    serializer_class = serializers.GetAllLeavesSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        return get_list_or_404(SalesRefLeave, salesref=item)
