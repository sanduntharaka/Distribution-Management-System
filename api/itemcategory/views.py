from tablib import Dataset
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from item_category.models import Category
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.views import APIView


class CreateCategory(generics.CreateAPIView):
    serializer_class = serializers.CreateCategorySerializer
    queryset = Category.objects.all()


class UpdateCategory(generics.UpdateAPIView):
    serializer_class = serializers.GetCategorySerializer
    queryset = Category.objects.all()


class DeleteCategory(generics.DestroyAPIView):
    serializer_class = serializers.GetCategorySerializer
    queryset = Category.objects.all()


class AllCategory(generics.ListAPIView):
    serializer_class = serializers.GetCategorySerializer
    queryset = Category.objects.all()


class CreateCategoryFromExcell(APIView):
    def row_generator(self, dataset, user):
        i = 1
        for row in dataset:

            category = {
                'category_name': row[0],
                'description': row[1],
                'foc_percentage': row[2],
                'date': row[3],
                'short_code':row[4],
                'added_by': user,
            }

            yield category, i
            i += 1

    def post(self, request):

        user_account = request.data['user']
        data_file = request.data['file']
        df = pd.read_excel(data_file)
        dataset = Dataset().load(df)
        erros_reson = []
        erros = []
        success = []
        for category, i in self.row_generator(dataset=dataset, user=user_account):

            serializer = serializers.CreateCategorySerializer(data=category)
            if serializer.is_valid():
                serializer.save()
                success.append(i)
            else:
                erros.append(i)
                erros_reson.append(serializer.errors)

        if len(erros) > 0 and len(success) < 1:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors': erros, 'resons': erros_reson}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors_count': len(erros), 'error_rows': erros, 'resons': erros_reson}, status=status.HTTP_201_CREATED)
