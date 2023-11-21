from reportclasses.rd_performance import RDPerformanceReportExcell
from datetime import datetime, timedelta
from inventory_history.models import DistributorHistoryItem
from reportclasses.distributor_performance import DistributorPerformanceReportExcell
from datetime import date, timedelta, datetime
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
        try:
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
        except Exception as e:
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetInventoryReportByDate(APIView):
    def post(self, request, *args, **kwargs):
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)

        given_date = datetime.strptime(date_from, "%Y-%m-%d")

        # Calculate the previous date
        previous_date = given_date - timedelta(days=1)

        # Convert the result back to a string if needed
        previous_date_str = previous_date.strftime("%Y-%m-%d")

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
                item=product, **filters).values('qty')

            try:
                history_item = DistributorHistoryItem.objects.get(
                    date=previous_date_str, item_item=product)
                history_item_total = history_item.qty + history_item.foc
            except:
                history_item_total = 0
            details['os'] = history_item_total
            details['purchase'] = sum([si['qty'] for si in stock_items])
            inv_items = Item.objects.filter(item__item=product, invoice_item__bill__date__range=(
                date_from, date_to), invoice_item__bill__dis_sales_ref__distributor=request.data['distributor']).values('qty', 'foc')
            details['sales'] = sum([sl['qty']+sl['foc'] for sl in inv_items])
            details['free_issues'] = sum([fi['foc'] for fi in inv_items])

            return_items = SalesRefReturnItem.objects.filter(item__item=product, salesrefreturn__date__range=(
                date_from, date_to),  salesrefreturn__dis_sales_ref__distributor=request.data['distributor']).values('qty', 'foc')
            details['market_returns'] = sum(
                [mr['qty']+mr['foc'] for mr in return_items])
            details['cs'] = (details['os'] + details['purchase']) - \
                (details['sales']+details['free_issues'] +
                 details['market_returns'])
            data.append(details)
        all_data = {'main_details': main_details, 'category_details': data}
        file_genearte = GenerateStockReportExcell(all_data)

        return file_genearte.generate()


class GetDistributorPerformance(APIView):
    def post(self, request, *args, **kwargs):
        try:
            today = date.today()
            now = datetime.now()
            current_month_name = now.strftime('%B')
            distributor = request.data['distributor']
            inventory_items = DistributorInventoryItems.objects.filter(
                inventory__distributor=distributor)
            main_details = {
                'name': UserDetails.objects.get(user=request.user).full_name,
                'distributor': UserDetails.objects.get(id=request.data['distributor']).full_name,
                'month': current_month_name,
                'current_dsr': ' ',

                #                 Date of Commencement

                # Total Amount Dealt (Rs.) todate

                # Average DCP

                # Dishonoured Cheques (Value/No)


            }
            data = []
            for product in inventory_items:
                details = {}

                details['product_name'] = product.description
                stock_items = ItemStock.objects.filter(
                    item=product, date__month=today.month)
                details['mqty'] = sum([
                    item.qty for item in stock_items])

                details['mfoc'] = sum([
                    item.foc for item in stock_items])

                details['mgp'] = ' '

                details['mvalue'] = sum([
                    item.get_qty_wholesale_multiple() for item in stock_items])

                details['mmret'] = sum([
                    item.qty+item.foc for item in SalesRefReturnItem.objects.filter(inventory_item=product, salesrefreturn__date__month=today.month)])

                stock_items_test = ItemStock.objects.filter(
                    item=product)

                details['cqty'] = sum([
                    item.qty for item in stock_items_test])
                details['cfoc'] = sum([
                    item.foc for item in stock_items_test])

                details['cgp'] = ' '

                details['cvalue'] = sum([
                    item.get_qty_wholesale_multiple() for item in stock_items_test])

                details['cmret'] = sum([
                    item.qty+item.foc for item in SalesRefReturnItem.objects.filter(inventory_item=product)])

                data.append(details)

                # Quantity	Value	GP	Free Issues	Market Ret.
            all_data = {'main_details': main_details, 'category_details': data}

            file_genearte = DistributorPerformanceReportExcell(all_data)

            return file_genearte.generate()
        except DistributorInventoryItems.DoesNotExist:
            return Response(data={'error': "Items not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(data={'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetDistributorRDPerformance(APIView):
    def post(self, request, *args, **kwargs):
        try:
            today = date.today()
            now = datetime.now()
            current_month_name = now.strftime('%B')
            first_day_of_current_month = today.replace(day=1)
            last_day_of_last_month = first_day_of_current_month - \
                timedelta(days=1)

            # Get the date for the last month
            last_month_date = last_day_of_last_month.replace(day=1)
            distributor = request.data['distributor']
            inventory_items = DistributorInventoryItems.objects.filter(
                inventory__distributor=distributor)
            main_details = {
                'name': UserDetails.objects.get(user=request.user).full_name,
                'distributor': UserDetails.objects.get(id=request.data['distributor']).full_name,
                'month': current_month_name,
                'current_dsr': ' ',
            }
            data = []
            for product in inventory_items:
                details = {}
                details['product_name'] = product.description

                sale_items_this = Item.objects.filter(item__item=product, invoice_item__bill__dis_sales_ref__distributor=distributor,
                                                      invoice_item__bill__date__month=today.month, invoice_item__bill__status='confirmed')

                sale_items_last = Item.objects.filter(item__item=product, invoice_item__bill__dis_sales_ref__distributor=distributor,
                                                      invoice_item__bill__date__month=last_month_date.month, invoice_item__bill__status='confirmed')

                details['this_vol_qty'] = sum([
                    item.qty + item.foc for item in sale_items_this])
                details['last_vol_qty'] = sum([
                    item.qty + item.foc for item in sale_items_last])
                details['vol_var'] = (
                    details['this_vol_qty']-details['last_vol_qty'])/100

                details['this_val_qty'] = sum([
                    item.qty *
                    (item.invoice_item.whole_sale_price if item.invoice_item.bill.billing_price_method ==
                     2 else item.invoice_item.price)
                    for item in sale_items_this
                    if item.invoice_item.bill.billing_price_method == 2
                    or item.invoice_item.bill.billing_price_method == 1
                ])
                details['last_val_qty'] = sum([
                    item.qty *
                    (item.invoice_item.whole_sale_price if item.invoice_item.bill.billing_price_method ==
                     2 else item.invoice_item.price)
                    for item in sale_items_last
                    if item.invoice_item.bill.billing_price_method == 2
                    or item.invoice_item.bill.billing_price_method == 1
                ])
                details['val_var'] = (
                    details['this_val_qty']-details['last_val_qty'])/100

                details['this_vol_foc'] = sum([
                    item.foc for item in sale_items_this])
                details['last_vol_foc'] = sum([
                    item.foc for item in sale_items_last])
                details['foc_var'] = (
                    details['this_vol_foc']-details['last_vol_foc'])/100

                market_returns_this = SalesRefReturnItem.objects.filter(
                    item__item=product, salesrefreturn__dis_sales_ref__distributor=distributor, salesrefreturn__date__month=today.month, salesrefreturn__status='approved'
                )

                market_returns_last = SalesRefReturnItem.objects.filter(
                    item__item=product, salesrefreturn__dis_sales_ref__distributor=distributor, salesrefreturn__date__month=today.month, salesrefreturn__status='approved'
                )

                details['this_vol_mret'] = sum([
                    item.qty + item.foc for item in market_returns_this])
                details['last_vol_mret'] = sum([
                    item.qty + item.foc for item in market_returns_last])
                details['mret_var'] = (
                    details['this_vol_mret']-details['last_vol_mret'])/100

                sale_items_year = Item.objects.filter(item__item=product, invoice_item__bill__dis_sales_ref__distributor=distributor,
                                                      invoice_item__bill__date__year=today.year, invoice_item__bill__status='confirmed')

                details['year_vol_qty'] = sum([
                    item.qty + item.foc for item in sale_items_year])

                details['year_val_qty'] = sum([
                    item.qty *
                    (item.invoice_item.whole_sale_price if item.invoice_item.bill.billing_price_method ==
                     2 else item.invoice_item.price)
                    for item in sale_items_year
                    if item.invoice_item.bill.billing_price_method == 2
                    or item.invoice_item.bill.billing_price_method == 1
                ])

                details['year_vol_foc'] = sum([
                    item.foc for item in sale_items_year])

                market_returns_year = SalesRefReturnItem.objects.filter(
                    item__item=product, salesrefreturn__dis_sales_ref__distributor=distributor, salesrefreturn__date__year=today.year, salesrefreturn__status='approved'
                )
                details['year_vol_mret'] = sum([
                    item.qty + item.foc for item in market_returns_year])

                data.append(details)

            all_data = {'main_details': main_details, 'category_details': data}
            file_genearte = RDPerformanceReportExcell(all_data)
            # Response(status=status.HTTP_200_OK)
            return file_genearte.generate()
        except DistributorInventoryItems.DoesNotExist:
            return Response(data={'error': "Items not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(data={'error': e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
