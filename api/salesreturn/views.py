from rest_framework import status
from rest_framework.response import Response
from sales_return.models import SalesReturn, SalesReturnItem
from distributor_inventory.models import DistributorInventoryItems
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404
from rest_framework.views import APIView


class AddReturn(generics.CreateAPIView):
    serializer_class = serializers.AddReturnSerializer
    queryset = SalesReturn.objects.all()


class GetReturns(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer
    queryset = SalesReturn.objects.all()


class GetReturn(generics.RetrieveAPIView):
    serializer_class = serializers.GetReturnsSerializer
    queryset = SalesReturn.objects.all()


class DeleteReturn(APIView):
    def delete(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        salesref_return = SalesReturn.objects.get(id=item)
        try:
            salesref_return.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AddReturnItem(APIView):

    def post(self, request, *args, **kwargs):

        sales_return = SalesReturn.objects.get(id=self.kwargs.get('id'))
        return_items = []
        try:
            for item in request.data['items']:
                print(item)
                return_items.append(SalesReturnItem(salesreturn=sales_return, item=DistributorInventoryItems.objects.get(
                    id=item['id']), qty=int(item['qty']), reason=item['reason']))
            print(return_items)

            SalesReturnItem.objects.bulk_create(return_items)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            sales_return.delete()
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetReturnItems(generics.ListAPIView):
    serializer_class = serializers.GetItemsSeraializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        return get_list_or_404(SalesReturnItem, salesreturn=item)
