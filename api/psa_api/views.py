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
    queryset = PrimarySalesArea.objects.all()
