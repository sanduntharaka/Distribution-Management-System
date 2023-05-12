from tablib import Dataset
import pandas as pd
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from company_inventory.models import CompanyInventory
from . import serializers
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from users.models import UserAccount
from item_category.models import Category


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


class AddInventoryFromExcel(APIView):

    def row_generator(self, dataset, user):
        i = 1
        for row in dataset:
            try:
                category = Category.objects.get(category_name=row[0]).id
            except:
                category = None
            data = {
                'category': category,
                'employee': user,
                'item_code': row[1],
                'description': row[2],
                'qty': row[3],
                'whole_sale_price': row[4],
                'retail_price': row[5],
            }
            i += 1
            yield data, i

    def post(self, request, *args, **kwargs):

        user_account = request.data['user']
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
        for row, i in self.row_generator(dataset=dataset, user=user_account):
            serializer = serializers.CompanyInventorySerializer(data=row)
            if serializer.is_valid():
                serializer.save()
                success.append(i)
            else:
                print(serializer.errors)
                erros.append(i)
                erros_reson.append(serializer.errors)
        if len(erros) > 0 and len(success) < 1:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors': erros, 'resons': erros_reson}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors_count': len(erros), 'error_rows': erros, 'resons': erros_reson}, status=status.HTTP_201_CREATED)
