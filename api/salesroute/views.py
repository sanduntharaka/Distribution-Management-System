from users.models import UserAccount
from userdetails.models import UserDetails
from sales_route.models import SalesRoute
from rest_framework import status
from rest_framework.response import Response
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404
from rest_framework.views import APIView


class CreateRoute(APIView):
    # serializer_class = serializers.AddRouteSerializer

    def post(self, request, *args, **kwargs):
        request_data = request.data
        salesref = request_data['sales_rep']
        dealers = [i['id'] for i in request_data['dealers']]

        serializer = serializers.AddRouteSerializer(
            data={'salesref': salesref, 'dealers': dealers})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)
