from rest_framework import status
from rest_framework.response import Response
from distributor_inventory.models import DistributorInventoryItems, DistributorInventory
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404
from users.models import UserAccount
from userdetails.models import UserDetails


class AddItems(generics.ListCreateAPIView):
    queryset = DistributorInventoryItems.objects.all()
    serializer_class = serializers.AddItemsSerializer


class GetDistributorInventory(generics.RetrieveAPIView):

    serializer_class = serializers.GetInventory

    def get_object(self, **kwargs):
        item = self.kwargs.get('id')
        dis_obj = UserDetails.objects.get(id=item)
        print("obj:", dis_obj)
        return get_object_or_404(DistributorInventory, distributor=dis_obj)


class GetDistributorItems(generics.RetrieveAPIView):
    serializer_class = serializers.AddItemsSerializer

    def get(self, request, *args, **kwargs):
        item = self.kwargs.get('pk')
        inventory_obj = DistributorInventory.objects.get(id=item)
        try:
            inventory_items = DistributorInventoryItems.objects.filter(
                inventory=inventory_obj)
            return Response(data=serializers.GetInventoryItems(inventory_items, many=True).data, status=status.HTTP_200_OK)
        except:
            return Response({"error": True}, status=status.HTTP_400_BAD_REQUEST)


class EditDistributorItem(generics.UpdateAPIView):
    serializer_class = serializers.EditItemsSerializer
    queryset = DistributorInventoryItems.objects.all()


class DeleteDistributorItem(generics.DestroyAPIView):
    serializer_class = serializers.EditItemsSerializer
    queryset = DistributorInventoryItems.objects.all()
