from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from dealer_details.models import Dealer
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_list_or_404
import pandas as pd
import json


class AddDealer(generics.CreateAPIView):
    serializer_class = serializers.AddDealerSerializer
    queryset = Dealer.objects.all()


class AddDealerExcel(APIView):
    def post(self, request):
        try:
            data_file = request.data['file']
            user = request.data['user']
            df = pd.read_excel(data_file)
            thisisjson = json.loads(df.to_json(orient='records'))
            for i in thisisjson:
                i['added_by'] = user

            serializer = serializers.AddDealerSerializer(
                data=thisisjson, many=True)

            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetAll(generics.ListAPIView):
    serializer_class = serializers.GetAllDealersSerializer
    queryset = Dealer.objects.all()


class DeleteDealer(generics.DestroyAPIView):
    serializer_class = serializers.AddDealerSerializer
    queryset = Dealer.objects.all()


class EditDealerDetails(generics.UpdateAPIView):
    serializer_class = serializers.EditDealersSerializer
    queryset = Dealer.objects.all()


class GetAllByDistributor(generics.ListAPIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')
        salesrefs = SalesRefDistributor.objects.filter(
            distributor=item).values('sales_ref')
        salesrefs_ids = [salesref['sales_ref']
                         for salesref in salesrefs]
        salesref_list = UserDetails.objects.filter(
            id__in=salesrefs_ids).values('user')
        distributoruser = UserDetails.objects.get(
            id=item)
        salesref_users_id = [sf['user']
                             for sf in salesref_list]
        salesref_users_id.append(distributoruser.user.id)
        dealers = Dealer.objects.filter(
            added_by__in=salesref_users_id)
        serializer = serializers.GetAllDealersSerializer(dealers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
