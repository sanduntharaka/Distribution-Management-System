from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from userdetails.models import UserDetails
import datetime
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
        date = request_data['date']
        dealers = [i['id'] for i in request_data['dealers']]
        dealer_objects = Dealer.objects.filter(id__in=dealers)
        psas = [i.psa.id for i in dealer_objects]
        unique_psas = list(set(psas))
        try:
            sales_route = SalesRoute.objects.get(salesref=salesref, date=date)

            serializer = serializers.AddRouteSerializer(
                data={'salesref': salesref, 'dealers': dealers, 'date': date, 'psas': unique_psas}, instance=sales_route)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except SalesRoute.DoesNotExist:

            serializer = serializers.AddRouteSerializer(
                data={'salesref': salesref, 'dealers': dealers, 'date': date, 'psas': unique_psas})
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(status=status.HTTP_400_BAD_REQUEST)


class GetSavedRoutes(APIView):
    def get(self, request, id, date):
        try:
            sales_routes = SalesRoute.objects.get(salesref=id, date=date)

            data = []
            for i in sales_routes.dealers:
                dealer_data = {}
                dealer = Dealer.objects.get(id=i)
                dealer_data['id'] = i
                dealer_data['name'] = dealer.name
                dealer_data['address'] = dealer.address
                data.append(dealer_data)

            return Response(data={'id': sales_routes.id, 'routs': data}, status=status.HTTP_200_OK)
        except SalesRoute.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class GetDetails(APIView):
    def post(self, request):
        print(request.data)
        date_obj = datetime.datetime.strptime(request.data['date'], "%Y-%m-%d")
        # day_of_week = date_obj.strftime("%A").lower()
        try:
            sales_route = SalesRoute.objects.get(
                salesref=request.data['salesref'], date=date_obj, is_approved=True)

            plan = []
            for i in sales_route.dealers:
                plan.append({
                    'name': Dealer.objects.get(id=i).name,
                    'address': Dealer.objects.get(id=i).address
                })

        except SalesRoute.DoesNotExist:
            plan = [{'name': 'Plan not Approved', 'address': ''}]

        try:

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

        return Response(data={'given': plan, 'coverd': covered}, status=status.HTTP_200_OK)


class ApproveRoute(APIView):
    def post(self, request, id):
        dealers = [i['id'] for i in request.data['dealers']]
        sales_route = SalesRoute.objects.get(id=id)
        sales_route.is_approved = True
        sales_route.approved_by = UserDetails.objects.get(
            user=request.user.id)
        old_dealers = sales_route.dealers

        if dealers == old_dealers:
            sales_route.save()
            return Response(status=status.HTTP_200_OK)
        else:

            dealer_objects = Dealer.objects.filter(id__in=dealers)
            psas = [i.psa.id for i in dealer_objects]
            unique_psas = list(set(psas))

            sales_route.dealers = dealers
            sales_route.psas = unique_psas
            sales_route.save()
            return Response(status=status.HTTP_200_OK)


class ToApprove(generics.ListAPIView):
    serializer_class = serializers.ToApproveSeraializer

    def get_queryset(self):

        distributors = list(ManagerDistributor.objects.filter(
            manager__user=self.request.user.id).values_list('distributor', flat=True))
        salesrefs = SalesRefDistributor.objects.filter(
            distributor__in=distributors).values_list('sales_ref', flat=True)

        sales_routes = SalesRoute.objects.filter(
            salesref__in=salesrefs, is_approved=False).order_by('date')

        return get_list_or_404(sales_routes)
