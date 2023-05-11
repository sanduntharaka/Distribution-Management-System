from item_category.models import Category
from rest_framework.views import APIView
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from distributor_inventory.models import DistributorInventoryItems, DistributorInventory
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404
from users.models import UserAccount
from userdetails.models import UserDetails
from tablib import Dataset


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


class AddItemsExcel(APIView):
    def row_generator(self, dataset, user, inventory):
        i = 1
        for row in dataset:
            try:
                category = Category.objects.get(category_name=row[0]).id
            except:
                category = None
            data = {
                'inventory': inventory,
                'added_by': user,
                'category': category,
                'item_code': row[1],
                'description': row[2],
                'qty': row[3],
                'whole_sale_price': row[4],
                'retail_price': row[5],
            }
            i += 1
            yield data, i

    def post(self, request):

        user_account = request.data['user']
        inventory = DistributorInventory.objects.get(
            id=request.data['inventory']).id
        file = request.data['file']
        df = pd.read_excel(file)
        rename_coulumns = {
            "Category": "category",
            "Item Code": "item_code",
            "Discription": "description",
            "Qty": "qty",
            "Whole Sale price": "whole_sale_price",
            "Retail price": "retail_price",
        }
        df.rename(columns=rename_coulumns, inplace=True)
        dataset = Dataset().load(df)
        erros_reson = []
        erros = []
        success = []
        for row, i in self.row_generator(dataset=dataset, user=user_account, inventory=inventory):
            try:
                serializer = serializers.AddItemsSerializer(data=row)
                if serializer.is_valid():
                    serializer.save()
                    print(row)
                    print(i)
                    success.append(i)
                else:
                    print(serializer.errors)
                    erros.append(i)
                    erros_reson.append(serializer.errors)
            except Exception as e:
                erros.append(i)
                erros_reson.append(e)

        if len(erros) > 0 and len(success) < 1:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors': erros, 'resons': erros_reson}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors_count': len(erros), 'error_rows': erros, 'resons': erros_reson}, status=status.HTTP_201_CREATED)
