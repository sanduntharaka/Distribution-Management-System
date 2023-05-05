from rest_framework import status
from rest_framework.response import Response
from not_buy_details.models import NotBuyDetails
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class AddNotBuy(generics.CreateAPIView):
    queryset = NotBuyDetails.objects.all()
    serializer_class = serializers.AddNotBuySerializer


class GeTAllNotBuy(generics.ListAPIView):
    queryset = NotBuyDetails.objects.all()
    serializer_class = serializers.GetNotBuySerializer


class EditNotBuy(generics.UpdateAPIView):
    queryset = NotBuyDetails.objects.all()
    serializer_class = serializers.AddNotBuySerializer


class DeleteNotBuy(generics.DestroyAPIView):
    queryset = NotBuyDetails.objects.all()
    serializer_class = serializers.AddNotBuySerializer
