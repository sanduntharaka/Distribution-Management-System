from userdetails.models import UserDetails
from distributor_inventory.models import DistributorInventoryItems
from reportclasses.stock_report import GenerateStockReportExcell
from salesref_return.models import SalesRefReturnItem
from distrubutor_salesref_invoice.models import InvoiceIntem, Item
from django.db.models import Sum
from item_category.models import Category
from distributor_inventory.models import ItemStock
from rest_framework import status
from rest_framework.response import Response
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems, ItemStock
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView

from django.shortcuts import get_object_or_404, get_list_or_404

from distributor_inventory.models import DistributorInventory

from distrubutor_salesref.models import SalesRefDistributor


class GetInventoryReport(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_company:
            inventory = request.data['distributor']
        if request.user.is_manager:
            inventory = request.data['distributor']
        if request.user.is_excecutive:
            inventory = request.data['distributor']
        if request.user.is_salesref:
            inventory = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor.id
        if request.user.is_distributor:
            inventory = self.kwargs.get('id')

        stock_type = int(request.data['stock_type'])
        category = int(request.data['category'])
        description = int(request.data['item'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        inventory = DistributorInventory.objects.get(distributor=inventory)
        filters = {
            'item__inventory': inventory,
            'qty__gte': 0,
        }
        if stock_type == 0:
            filters['qty'] = 0

        if by_date:
            filters['date__range'] = (date_from, date_to)

        if category != -1:
            filters['item__category'] = category

        if description != -1:
            filters['item__id'] = description

        items = ItemStock.objects.filter(**filters)
        serializer = serializers.InventoryItemsSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetInventoryReportByDate(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        main_details = {
            'distributor': UserDetails.objects.get(id=request.data['distributor']).full_name,
            'date': date_to
        }

        filters = {
            'item__inventory__distributor': request.data['distributor'],
        }

        if by_date:
            filters['date__range'] = (date_from, date_to)

        products = DistributorInventoryItems.objects.filter(
            inventory__distributor=request.data['distributor'])

        data = []
        for product in products:
            details = {}

            details['product_name'] = product.description

            stock_items = ItemStock.objects.filter(
                item__category=product.category, **filters).values('qty')
            details['purchase'] = sum([si['qty'] for si in stock_items])
            inv_items = Item.objects.filter(item__item__category=product.category, invoice_item__bill__date__range=(
                date_from, date_to), invoice_item__bill__dis_sales_ref__distributor=request.data['distributor']).values('qty', 'foc')
            details['sales'] = sum([sl['qty']+sl['foc'] for sl in inv_items])
            details['free_issues'] = sum([fi['foc'] for fi in inv_items])

            return_items = SalesRefReturnItem.objects.filter(item__item__category=product.category, salesrefreturn__date__range=(
                date_from, date_to),  salesrefreturn__dis_sales_ref__distributor=request.data['distributor']).values('qty', 'foc')
            details['market_returns'] = sum(
                [mr['qty']+mr['foc'] for mr in return_items])
            data.append(details)
        all_data = {'main_details': main_details, 'category_details': data}
        print(all_data)
        file_genearte = GenerateStockReportExcell(all_data)

        return file_genearte.generate()
