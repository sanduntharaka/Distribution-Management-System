from users.models import UserAccount
from dealer_details.models import Dealer
from sales_route.models import SalesRoute, DailyStatus
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
        try:
            sales_route = SalesRoute.objects.get(salesref=salesref)

            serializer = serializers.AddRouteSerializer(
                data={'salesref': salesref, 'dealers': dealers}, instance=sales_route)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except SalesRoute.DoesNotExist:

            serializer = serializers.AddRouteSerializer(
                data={'salesref': salesref, 'dealers': dealers})
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(status=status.HTTP_400_BAD_REQUEST)


class GetSavedRoutes(APIView):
    def get(self, request, id):
        sales_routes = SalesRoute.objects.get(salesref=id)
        data = []
        for i in sales_routes.dealers:
            dealer_data = {}
            dealer = Dealer.objects.get(id=i)
            dealer_data['id'] = i
            dealer_data['name'] = dealer.name
            dealer_data['address'] = dealer.address
            data.append(dealer_data)

        return Response(data=data, status=status.HTTP_200_OK)


class GetDetails(APIView):
    def post(self, request):
        try:
            sales_route = SalesRoute.objects.get(
                salesref=request.data['salesref'])

            plan = []
            for i in sales_route.dealers:
                plan.append({
                    'name': Dealer.objects.get(id=i).name,
                    'address': Dealer.objects.get(id=i).address
                })

        except SalesRoute.DoesNotExist:
            plan = []
            print("no")
        try:
            print("y")
            requested_route = DailyStatus.objects.get(
                date=request.data['date'], route__salesref=request.data['salesref'])
            covered = []
            for c in requested_route.coverd:
                covered.append({
                    'name': Dealer.objects.get(id=c['id']).name,
                    'address': Dealer.objects.get(id=c['id']).address,
                    'time': c['time'],
                    'status': c['status']

                })

        except DailyStatus.DoesNotExist:
            covered = []
            print('Not exist')

        return Response(data={'given': plan, 'coverd': covered}, status=status.HTTP_200_OK)
