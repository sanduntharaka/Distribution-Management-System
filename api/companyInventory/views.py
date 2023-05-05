from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from company_inventory.models import CompanyInventory
from . import serializers
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class AddInventory(generics.CreateAPIView):
    queryset = CompanyInventory.objects.all()
    serializer_class = serializers.CompanyInventorySerializer


class ListProducts(APIView):
    def get(self, request):
        products = CompanyInventory.objects.all()
        serializer = serializers.GetCompanyInventory(products, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class Getproduct(generics.RetrieveAPIView):
    serializer_class = serializers.CompanyProductViewSerializer

    def get_object(self, queryset=None, **kwargs):
        item = self.kwargs.get('id')

        return get_object_or_404(CompanyInventory, id=item)


class EditProduct(generics.UpdateAPIView):
    serializer_class = serializers.CompanyProductEditSerializer
    queryset = CompanyInventory.objects.all()


class DeleteProduct(generics.DestroyAPIView):
    serializer_class = serializers.CompanyInventorySerializer
    queryset = CompanyInventory.objects.all()
