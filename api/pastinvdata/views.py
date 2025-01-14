from item_category.models import Category
from rest_framework.views import APIView
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from past_invoice_data.models import PastInvoice, PastCheque
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404
from users.models import UserAccount
from userdetails.models import UserDetails
from tablib import Dataset

from dealer_details.models import Dealer
from datetime import datetime


class AddInvoiceExcel(APIView):
    def row_generator(self, dataset, user):
        i = 1

        for row in dataset:

            data = {
                'distributor': user,
                'inv_date':  pd.to_datetime(row[0], format="%d/%m/%Y").date(),
                'inv_number': row[1],
                'customer_name': row[2],
                'original_amount': row[3],
                'paid_amount': row[4],
                'balance_amount': row[5],
            }
            i += 1
            yield data, i

    def post(self, request, *args, **kwargs):

        distributor = self.kwargs.get('id')
        file = request.data['file']
        df = pd.read_excel(file)
        dataset = Dataset().load(df)
        erros_reson = []
        erros = []
        success = []

        for row, i in self.row_generator(dataset=dataset, user=distributor):
            try:
                serializer = serializers.AddInvSerializer(data=row)
                if serializer.is_valid():
                    serializer.save()

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


class AddInvoice(generics.CreateAPIView):
    serializer_class = serializers.AddInvSerializer
    queryset = PastInvoice.objects.all()


class UpdateInvoice(generics.UpdateAPIView):
    serializer_class = serializers.UpdateInvSerializer
    queryset = PastInvoice.objects.all()


class DeleteInvoice(generics.DestroyAPIView):
    serializer_class = serializers.AddInvSerializer
    queryset = PastInvoice.objects.all()


class ViewInvoices(APIView):
    # serializer_class = serializers.ViewInvSerializer

    def get(self, request, *args, **kwargs):
        try:
            item = self.kwargs.get('id')
            past_inv = PastInvoice.objects.filter(distributor=item)
            serializer = serializers.ViewInvSerializer(past_inv, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AddChequeExcel(APIView):
    def row_generator(self, dataset, user):
        i = 1
        for row in dataset:
            data = {
                'distributor': user,
                'inv_date': pd.to_datetime(row[0], format="%d/%m/%Y").date(),
                'inv_number': row[1],
                "cheque_number": row[2],
                "bank": row[3],
                "cheque_deposite_date": pd.to_datetime(row[4], format="%d/%m/%Y").date(),
                'customer_name': row[5],
                'original_amount': row[6],
                'paid_amount': row[7],
                'balance_amount': row[8],

            }
            i += 1
            yield data, i

    def post(self, request, *args, **kwargs):
        distributor = self.kwargs.get('id')
        file = request.data['file']
        df = pd.read_excel(file)
        dataset = Dataset().load(df)
        erros_reson = []
        erros = []
        success = []
        for row, i in self.row_generator(dataset=dataset, user=distributor):
            try:
                serializer = serializers.AddChequeSerializer(data=row)
                if serializer.is_valid():
                    serializer.save()
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


class AddCheque(generics.CreateAPIView):
    serializer_class = serializers.AddChequeSerializer
    queryset = PastCheque.objects.all()


class ViewCheque(generics.ListAPIView):
    serializer_class = serializers.ViewChequeSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        print('called')
        return get_list_or_404(PastCheque, distributor=item)


class UpdateCheque(generics.UpdateAPIView):
    serializer_class = serializers.UpdateChequeSerializer
    queryset = PastCheque.objects.all()


class DeleteCheque(generics.DestroyAPIView):
    serializer_class = serializers.AddChequeSerializer
    queryset = PastCheque.objects.all()
