from distrubutor_salesref_invoice.models import SalesRefInvoice
from django.db.models import Sum
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
from targets.models import DistributorTargets, SalesrefTargets, SalesrefValueTarget, SalesrepDailyValueTarget


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
    # queryset = DistributorTargets.objects.all()

    def get_queryset(self):
        queryset = DistributorTargets.objects.all()
        user = self.request.user
        if user.is_manager:
            queryset = queryset.filter(added_by=user.id)
        return queryset


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
        data['target_person'] = data['salesrep']

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ViewSalesrepTargets(generics.ListAPIView):
    serializer_class = serializers.ShowSalesrepTargetsSerializer
    # queryset = SalesrefTargets.objects.all()

    def get_queryset(self):
        queryset = SalesrefTargets.objects.all()
        user = self.request.user
        if user.is_manager:
            queryset = queryset.filter(added_by=user.id)
        return queryset


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


class AddSalesrepValueTargets(generics.CreateAPIView):
    serializer_class = serializers.AddSalesrefValueTargetsSerializer
    queryset = SalesrefValueTarget.objects.all()


class ViewSalesrepValueTargets(generics.ListAPIView):
    serializer_class = serializers.ShowSalesrepValueTargetsSerializer
    # queryset = SalesrefValueTarget.objects.all()

    def get_queryset(self):
        queryset = SalesrefValueTarget.objects.all()
        user = self.request.user
        if user.is_manager:
            queryset = queryset.filter(added_by=user.id)
        return queryset


class AddDailyValue(generics.CreateAPIView):
    serializer_class = serializers.AddDailyValueSalesrep
    queryset = SalesrepDailyValueTarget.objects.all()


class ViewDailyDetails(APIView):
    def post(self, request):
        targets = SalesrepDailyValueTarget.objects.filter(
            salesrep__id=request.data['salesref'], date=request.data['date'], added_by__id=request.user.id)
        data = []
        for target in targets:
            total = SalesRefInvoice.objects.filter(
                added_by__id=request.data['salesref'], dealer__psa__id=target.psa.id, date=request.data['date']).aggregate(
                total_invoices=Sum('total'))['total_invoices']
            print(target.psa.id)
            data.append({
                'date': target.date,
                'psa': target.psa.id,
                'value': target.value,
                'covered': 0 if total is None else total
            })
        print(data)
        return Response(data=data, status=status.HTTP_200_OK)
