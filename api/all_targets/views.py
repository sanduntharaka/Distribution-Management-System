from distrubutor_salesref_invoice.models import InvoiceIntem, SalesRefDistributor, Item
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_list_or_404, get_object_or_404
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from targets.models import DistributorTargets, SalesrefTargets


class AddDistributorTargets(generics.CreateAPIView):
    serializer_class = serializers.AddDistributorTargetsSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        manager_distributor = ManagerDistributor.objects.get(
            distributor=data['distributor'])
        data['manager_distributor'] = manager_distributor.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ViewDistributorTargets(generics.ListAPIView):
    serializer_class = serializers.ShowDistributorTargetsSerializer
    queryset = DistributorTargets.objects.all()


class EditDistributorTargets(generics.UpdateAPIView):
    serializer_class = serializers.EditDistributorTargetsSerializer
    queryset = DistributorTargets.objects.all()


class DeleteDistributorTargets(generics.DestroyAPIView):
    serializer_class = serializers.AddDistributorTargetsSerializer
    queryset = DistributorTargets.objects.all()


class AddSalesrepTargets(generics.CreateAPIView):
    serializer_class = serializers.AddSalesrepTargetsSerializer

    def create(self, request, *args, **kwargs):

        data = request.data
        salesrep_distributor = SalesRefDistributor.objects.get(
            sales_ref=data['salesrep'])
        data['salesrep_distributor'] = salesrep_distributor.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ViewSalesrepTargets(generics.ListAPIView):
    serializer_class = serializers.ShowSalesrepTargetsSerializer
    queryset = SalesrefTargets.objects.all()


class EditSalesrepTargets(generics.UpdateAPIView):
    serializer_class = serializers.EditSalesrepTargetsSerializer
    queryset = SalesrefTargets.objects.all()


class DeleteSalesrepTargets(generics.DestroyAPIView):
    serializer_class = serializers.AddSalesrepTargetsSerializer()
    queryset = SalesrefTargets.objects.all()


class AllAssignedRanges(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        try:
            targets = DistributorTargets.objects.filter(
                manager_distributor__distributor=kwargs.get('id'))
            if len(targets) == 0:
                raise Exception

            data = []
            seen_ranges = set()  # To keep track of seen date ranges

            for i in targets:
                date_range = (i.date_form, i.date_to)
                if date_range not in seen_ranges:
                    data.append({
                        'id': i.id,
                        'date_from': i.date_form,
                        'date_to': i.date_to,
                    })
                    seen_ranges.add(date_range)

        except:
            targets = SalesrefTargets.objects.filter(
                salesrep_distributor__sales_ref=kwargs.get('id'))
            data = []
            seen_ranges = set()  # To keep track of seen date ranges

            for i in targets:
                date_range = (i.date_form, i.date_to)
                if date_range not in seen_ranges:
                    data.append({
                        'id': i.id,
                        'date_from': i.date_form,
                        'date_to': i.date_to,
                    })
                    seen_ranges.add(date_range)

        return Response(data=data, status=status.HTTP_200_OK)


class RangeDetails(APIView):
    def post(self, request):
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        person = request.data['person']
        try:

            targets = DistributorTargets.objects.filter(
                manager_distributor__distributor=person)

            if len(targets) == 0:
                raise Exception

        except:
            targets = SalesrefTargets.objects.filter(
                salesrep_distributor__sales_ref=person)

        data = []
        for target in targets:
            data.append({
                'category': target.category.category_name,
                'target': target.amount,
                'achieved': sum(list(Item.objects.filter(invoice_item__bill__date__range=(
                    date_from, date_to), invoice_item__bill__status='confirmed', item__item__category__id=target.category.id).values_list('invoice_item__bill__total', flat=True)))
            })

        return Response(data=data, status=status.HTTP_200_OK)
