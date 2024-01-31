from distrubutor_salesref.models import SalesRefDistributor
import math
from item_category.models import Category
from rest_framework.views import APIView
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from distributor_inventory.models import DistributorInventoryItems, DistributorInventory, ItemStock, DistributorItemsInvoice
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404
# from users.models import UserAccount
from userdetails.models import UserDetails
from tablib import Dataset
import json

from users.models import UserAccount


class AddNewItems(generics.CreateAPIView):
    serializer_class = serializers.AddItemsSerializer
    queryset = DistributorInventoryItems.objects.all()

    def create(self, request, *args, **kwargs):
        print(request.data)
        return super().create(request, *args, **kwargs)
    # def create(self, request, *args, **kwargs):
    #     item_serializer = self.get_serializer(data=request.data)
    #     item_serializer.is_valid(raise_exception=True)
    #     item = item_serializer.save()

    #     item_details = {
    #         'item': item.id,
    #         'qty': request.data['qty'],
    #         'pack_size': request.data.get('pack_size', 0),
    #         'foc': request.data['free_of_charge'],
    #         'whole_sale_price': request.data['whole_sale_price'],
    #         'retail_price': request.data['retail_price'],
    #         'from_sales_return': request.data.get('from_sales_return', False),
    #         'invoice_number': request.data.get('invoice_number', 'INV-0000'),
    #         'added_by': request.data['added_by']
    #     }
    #     item_details_serializer = serializers.AddItemDetailsSerializer(
    #         data=item_details)
    #     try:
    #         item_details_serializer.is_valid(raise_exception=True)
    #         item_details_serializer.save()
    #     except Exception as e:
    #         print(e)
    #         item.delete()
    #         return Response(status=status.HTTP_400_BAD_REQUEST)

    #     return Response(status=status.HTTP_201_CREATED)


class AddExistingItems(generics.CreateAPIView):
    # queryset = ItemStock.objects.all()
    # serializer_class = serializers.AddItemDetailsSerializer

    def create(self, request, *args, **kwargs):
        inv_data = request.data['invoice']
        items_data = request.data['items']
        # item_serializer.is_valid(raise_exception=True)
        # item = item_serializer.save()

        try:
            invoice_obj = DistributorItemsInvoice.objects.get(
                invoice_number=inv_data['invoice_number'])
            invoice = invoice_obj.id
        except Exception as e:
            print('Er1:', e)
            bill_data = {
                'inventory': inv_data['inventory'],
                'invoice_number': inv_data.get('invoice_number', 'INV-0000'),
                'page_number': inv_data.get('page_number', 0),
                'total': inv_data.get('pay_total', 0),
                'discount': inv_data.get('discount', 0),
                'due_date': inv_data.get('due_date', 0),
                'date': inv_data.get('date'),
            }
            invoice_add = serializers.AddInvoiceDetailsSerializer(
                data=bill_data)
            if invoice_add.is_valid():
                saved = invoice_add.save()
                invoice = saved.id

            else:
                print('err', invoice_add.errors)

        bulk_items = []
        try:
            for item in items_data:
                obj = {
                    'invoice': invoice,
                    'item': item['id'],
                    'qty': int(item['qty'])+int(item['foc']),
                    'pack_size': item['pack_size'] if item['pack_size'] is not None else 0,
                    'from_sales_return': inv_data['from_sales_return'],
                    'foc': item['foc'],
                    'whole_sale_price': item['whole_sale_price'],
                    'retail_price': item['retail_price'],
                    'date': inv_data['date'],
                    'bill_qty': item['qty'],
                    'bill_foc': item['foc'],
                    'initial_qty': DistributorInventoryItems.objects.get(
                        id=item['id']).get_total_qty(),
                    'initial_foc': DistributorInventoryItems.objects.get(
                        id=item['id']).get_total_foc(),
                    'added_by': inv_data['added_by'],
                }
                serializer = serializers.AddItemDetailsSerializer(data=obj)
                if serializer.is_valid():
                    serializer.save()
                else:
                    print('bulkError:', serializer.errors)

            ItemStock.objects.bulk_create(bulk_items)

            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(data={'error': e}, status=status.HTTP_400_BAD_REQUEST)


class CheckInvoiceDetails(APIView):
    def get(self, request, *args, **kwargs):
        code = self.kwargs.get('code')
        user = self.request.user
        try:
            invoices = DistributorItemsInvoice.objects.filter(
                invoice_number=code, inventory__distributor__user=user)
            pages = [invoice.page_number for invoice in invoices]
            return Response(data={'invoice': True, 'pages': pages}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data={'invoice': False}, status=status.HTTP_200_OK)


class GetAllInvoices(generics.ListAPIView):
    serializer_class = serializers.GetDinstributorInvoicesSeralizer

    def get_queryset(self, *args, **kwargs):
        inventory = self.kwargs.get('id')

        return get_list_or_404(DistributorItemsInvoice, inventory=inventory)


class ViewInvoice(APIView):
    def post(self, request, *args, **kwargs):
        inventory = self.kwargs.get('id')
        inv_number = request.data['invoice_number']
        page_number = request.data['page_number']
        date = request.data['date']
        due_date = request.data['due_date']

        invoice = DistributorItemsInvoice.objects.get(
            inventory=inventory,
            invoice_number=inv_number,
            page_number=page_number,
            due_date=due_date,
            date=date
        )

        inv_items = ItemStock.objects.filter(invoice=invoice)
        main_details = {
            'distributor': invoice.inventory.distributor.full_name,
            'invoice_number': invoice.invoice_number,
            'date': invoice.date,
            'due_date': invoice.due_date,
            'total': invoice.total,
            'discount': invoice.discount,
            'dealer_name': invoice.inventory.distributor.full_name,
            'dealer': invoice.inventory.distributor.id,
            'dealer_address': invoice.inventory.distributor.address,
            'contact_number': invoice.inventory.distributor.company_number,
        }
        items = []
        for item in inv_items:
            item_details = {
                'item_code': item.item.item_code,
                'description': item.item.description,
                'qty': item.bill_qty,
                'pack_size': item.pack_size,
                'foc': item.bill_foc,
                'whole_sale_price': 0 if str(item.whole_sale_price) == 'nan' else item.whole_sale_price,
                'retail_price': 0 if str(item.retail_price) == 'nan' else item.retail_price,
                'date': item.date,
                'extended_price': 0 if str(item.whole_sale_price) == 'nan' else item.whole_sale_price*(item.bill_qty)
            }
            items.append(item_details)

        return Response(data={'invoice': main_details, 'items': items}, status=status.HTTP_200_OK)


class GetDistributorInventoryItems(generics.ListAPIView):
    serializer_class = serializers.GetInventoryItems
    pagination_class = None

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        queryset = get_list_or_404(DistributorInventoryItems, inventory=item)
        return queryset


class GetDistributorInventoryItemsByUser(generics.ListAPIView):
    serializer_class = serializers.GetInventoryItems

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(DistributorInventoryItems, inventory__distributor__id=item)


class GetDistributorInventory(generics.RetrieveAPIView):

    serializer_class = serializers.GetInventory

    def get_object(self, **kwargs):
        item = self.kwargs.get('id')
        dis_obj = UserDetails.objects.get(id=item)
        return get_object_or_404(DistributorInventory, distributor=dis_obj)


class GetDistributorItems(generics.ListAPIView):
    serializer_class = serializers.GetInventoryItemsStoks

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('pk')

        print(ItemStock.objects.filter(item=item).last().qty)
        return get_list_or_404(ItemStock, item=item)


class EditDistributorItem(generics.UpdateAPIView):
    serializer_class = serializers.EditItemsSerializer
    queryset = DistributorInventoryItems.objects.all()


class EditDistributorItemStock(generics.UpdateAPIView):
    serializer_class = serializers.EditStockSerializer
    queryset = ItemStock.objects.all()


class DeleteDistributorItem(generics.DestroyAPIView):
    serializer_class = serializers.EditItemsSerializer
    queryset = DistributorInventoryItems.objects.all()


class DeleteDistributorStock(generics.DestroyAPIView):
    serializer_class = serializers.EditStockSerializer
    queryset = ItemStock.objects.all()


# class AddItemsExcel(APIView):
#     def row_generator(self, dataset, user, inventory):
#         i = 1
#         for row in dataset:
#             print('mrow:', row)
#             try:
#                 print(1)
#                 item = DistributorInventoryItems.objects.get(
#                     category__id=row['category'], item_code=row['item_code'], inventory=inventory, description=row['description'])
#                 stock_data = {
#                     'item': item.id,
#                     'pack_size': 0 if math.isnan(row['pack_size']) else row['pack_size'],
#                     'qty': row['qty'],
#                     'foc': row['foc'],
#                     'whole_sale_price': row['whole_sale_price'],
#                     'retail_price': row['retail_price'],
#                     'added_by': user,
#                     'date': row['date'],
#                     'invoice': row['invoice'],
#                 }

#                 print(2)

#                 yield 'stock', item, stock_data, i
#                 i += 1
#             except Exception as e:
#                 print(3)
#                 print(e)

#                 item_data = {
#                     'inventory': inventory,
#                     'added_by': user,
#                     'category': row['category'],
#                     'item_code': row['item_code'],
#                     'description': row['description'],
#                     'base': row['base'] if row['base'] is not None else "",
#                     'date': row['date']

#                 }
#                 stock_data = {
#                     'pack_size': row['pack_size'] if row['pack_size'] is not None else 0,
#                     'qty': row['qty'],
#                     'foc': row['foc'],
#                     'whole_sale_price': row['whole_sale_price'],
#                     'retail_price': row['retail_price'],
#                     'added_by': user,
#                     'date': row['date'],
#                     'invoice': row['invoice'],

#                 }

#                 yield 'item', item_data, stock_data, i
#                 i += 1

#     def post(self, request):

#         user_account = request.data['user']
#         inventory = DistributorInventory.objects.get(
#             id=request.data['inventory']).id
#         file = request.data['file']
#         df = pd.read_excel(file)
#         thisisjson = json.loads(df.to_json(
#             orient='records', date_format='iso'))

#         erros_reson = []
#         erros = []
#         success = []
#         print(thisisjson)
#         for data_status, row, stock_data, i in self.row_generator(dataset=thisisjson, user=user_account, inventory=inventory):

#             print('i:', i)
#             print('row:', row)
#             print('ds:', data_status)
#             print('std:', stock_data)

#             # if DistributorInventoryItems is alredy saved
#             if data_status == 'stock':
#                 stock_serializer = serializers.AddItemDetailsSerializer(
#                     data=stock_data)
#                 if stock_serializer.is_valid():
#                     stock_serializer.save()
#                     success.append(i)
#                 else:
#                     print(stock_serializer.errors)
#                     erros.append(i)
#                     erros_reson.append(stock_serializer.errors)
#             else:
#                 try:
#                     serializer = serializers.AddItemsSerializer(data=row)
#                     if serializer.is_valid():
#                         saved = serializer.save()
#                         print('sid:', saved.id)
#                         stock_data['item'] = saved.id
#                         print('data:', stock_data)

#                         stock_serializer = serializers.AddItemDetailsSerializer(
#                             data=stock_data)

#                         if stock_serializer.is_valid():
#                             stock_serializer.save()
#                             success.append(i)
#                         else:
#                             erros.append(i)
#                             erros_reson.append(stock_serializer.errors)
#                     else:

#                         erros.append(i)
#                         erros_reson.append(serializer.errors)
#                 except Exception as e:
#                     erros.append(i)
#                     erros_reson.append(e)
#         if len(erros) > 0 and len(success) < 1:
#             return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors': erros, 'resons': erros_reson}, status=status.HTTP_406_NOT_ACCEPTABLE)
#         else:
#             return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors_count': len(erros), 'error_rows': erros, 'resons': erros_reson}, status=status.HTTP_201_CREATED)


class AddItemsExcel(APIView):
    def row_generator(self, dataset, user, inventory):
        i = 1
        for row in dataset:
            try:
                invoice = DistributorItemsInvoice.objects.get(
                    invoice_number=row[10], inventory=inventory, due_date=row[11])
                inv_id = invoice.id
            except DistributorItemsInvoice.DoesNotExist:
                invoice = DistributorItemsInvoice(inventory=DistributorInventory.objects.get(id=inventory),
                                                  invoice_number=row[10],
                                                  page_number=row[12],
                                                  total=row[14],
                                                  discount=row[13],
                                                  due_date=row[11])
                invoice.save()
                inv_id = invoice.id

            try:
                item = DistributorInventoryItems.objects.get(
                    category__id=row[0],
                    item_code=row[1],
                    inventory=inventory,
                    description=row[2])

                stock_data = {
                    'invoice': inv_id,
                    'item': item.id,
                    'pack_size': 0 if math.isnan(row[4]) else row[4],
                    'qty': int(row[5])+int(row[6]),
                    'foc': row[6],
                    'whole_sale_price': row[7],
                    'retail_price': row[8],
                    'added_by': user,
                    'date': row[9],
                    'invoice_number': row[10],
                    'from_sales_return': False,
                    'from_market_return': False,
                    'bill_qty': row[5],
                    'bill_foc': row[6],
                    'initial_qty': 0,
                    'initial_foc': 0,

                }

                yield 'stock', item, stock_data, i
                i += 1
            except Exception as e:

                item_data = {
                    'inventory': inventory,
                    'added_by': user,
                    'category': row[0],
                    'item_code': row[1],
                    'description': row[2],
                    'base': row[3] if row[3] is not None else "",
                    'date': row[9]

                }
                stock_data = {
                    'invoice': inv_id,
                    'pack_size': row[4] if row[4] is not None else 0,
                    'qty': int(row[5])+int(row[6]),
                    'foc': row[6],
                    'whole_sale_price': row[7],
                    'retail_price': row[8],
                    'added_by': user,
                    'date': row[9],
                    'invoice_number': row[10],
                    'from_sales_return': False,
                    'from_market_return': False,
                    'bill_qty': row[5],
                    'bill_foc': row[6],
                    'initial_qty': 0,
                    'initial_foc': 0,

                }

                yield 'item', item_data, stock_data, i
                i += 1

    def post(self, request):

        user_account = request.data['user']
        inventory = DistributorInventory.objects.get(
            id=request.data['inventory']).id
        data_file = request.data['file']
        df = pd.read_excel(data_file)
        dataset = Dataset().load(df)
        erros_reson = []
        erros = []
        success = []
        for data_status, row, stock_data, i in self.row_generator(dataset=dataset, user=user_account, inventory=inventory):
            # if DistributorInventoryItems is alredy saved
            if data_status == 'stock':
                stock_serializer = serializers.AddItemDetailsSerializer(
                    data=stock_data)
                if stock_serializer.is_valid():
                    stock_serializer.save()
                    success.append(i)
                else:
                    print(stock_serializer.errors)
                    erros.append(i)
                    erros_reson.append(stock_serializer.errors)
            else:
                try:
                    serializer = serializers.AddItemsSerializer(data=row)
                    if serializer.is_valid():
                        saved = serializer.save()

                        stock_data['item'] = saved.id

                        stock_serializer = serializers.AddItemDetailsSerializer(
                            data=stock_data)

                        if stock_serializer.is_valid():
                            stock_serializer.save()
                            success.append(i)
                        else:
                            erros.append(i)
                            erros_reson.append(stock_serializer.errors)
                    else:

                        erros.append(i)
                        erros_reson.append(serializer.errors)
                except Exception as e:
                    erros.append(i)
                    erros_reson.append(e)
        if len(erros) > 0 and len(success) < 1:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors': erros, 'resons': erros_reson}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response({'added_count': len(success), 'added_count': len(success), 'added': success, 'errors_count': len(erros), 'error_rows': erros, 'resons': erros_reson}, status=status.HTTP_201_CREATED)


class AllSalesrefsByDistributor(generics.ListAPIView):
    serializer_class = serializers.MySalesrefs
    pagination_class = None

    def get_queryset(self):
        item = self.kwargs.get('id')
        return get_list_or_404(SalesRefDistributor, distributor=item)


class GetProductDetails(generics.RetrieveAPIView):
    serializer_class = serializers.GetInventoryItemsStoks

    def get(self, queryset=None, **kwargs):
        code = self.kwargs.get('code')
        data = ItemStock.objects.filter(item__item_code=code).last()
        serializer = serializers.GetInventoryItemsStoks(data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
