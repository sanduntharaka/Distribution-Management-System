from rest_framework import status
from rest_framework.response import Response
from dealer_details.models import Dealer
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404


class AddDealer(generics.CreateAPIView):
    serializer_class = serializers.AddDealerSerializer
    queryset = Dealer.objects.all()


class GetAll(generics.ListAPIView):
    serializer_class = serializers.GetAllDealersSerializer
    queryset = Dealer.objects.all()


class DeleteDealer(generics.DestroyAPIView):
    serializer_class = serializers.AddDealerSerializer
    queryset = Dealer.objects.all()


class EditDealerDetails(generics.UpdateAPIView):
    serializer_class = serializers.EditDealersSerializer
    queryset = Dealer.objects.all()
