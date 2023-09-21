from django.db.models import Sum
from distrubutor_salesref_invoice.ReduceDistributorQuantity import ReduceQuantity
from distributor_inventory.ReduceMretInventory import ReduceMRetQuantity

from distrubutor_salesref.models import SalesRefDistributor
from rest_framework import status
from rest_framework.response import Response
from salesref_return.models import SalesRefReturn, SalesRefReturnItem
from distributor_inventory.models import DistributorInventoryItems, ItemStock
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404
from rest_framework.views import APIView
from dealer_details.models import Dealer


class AddReturn(generics.CreateAPIView):
    get_serializer = serializers.AddReturnSerializer

    def create(self, request, *args, **kwargs):
        last_bill = SalesRefReturn.objects.all().last()
        data = self.request.data
        print(data)
        data['bill_code'] = 'MRET' + \
            Dealer.objects.get(
            id=data['dealer']).psa.area_name[:3].upper()
        if last_bill is not None:
            bill_number = last_bill.bill_number
            data['bill_number'] = bill_number+1
        else:
            data['bill_number'] = 1

        try:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GetReturns(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer
    queryset = SalesRefReturn.objects.all()


class GetReturnsByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        print(item)
        return get_list_or_404(SalesRefReturn, dis_sales_ref__distributor=item)


class GetReturnsByDSalesref(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        print(item)
        return get_list_or_404(SalesRefReturn, dis_sales_ref__sales_ref=item)


class GetReturnsByOthers(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(SalesRefReturn, dis_sales_ref__distributor=item)


class GetReturn(generics.RetrieveAPIView):
    serializer_class = serializers.GetReturnsSerializer
    queryset = SalesRefReturn.objects.all()


class GetPendingReturns(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self):

        return get_list_or_404(SalesRefReturn, status='pending')


class GetPendingReturnsByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        disti_refs = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).values('id')
        distributorsrf_ids = [distributor['id']
                              for distributor in disti_refs]
        return get_list_or_404(SalesRefReturn, status='pending', dis_sales_ref__in=distributorsrf_ids)


class UpdateStatusPendingReturns(generics.UpdateAPIView):
    serializer_class = serializers.UpdateReturnStatusSerializer

    def update(self, request, *args, **kwargs):
        item = self.kwargs.get('pk')
        return_bill = SalesRefReturn.objects.get(id=item)
        print(return_bill)
        return_items = SalesRefReturnItem.objects.filter(
            salesrefreturn=return_bill)
        print(return_items)
        return_bill.status = request.data['status']

        try:
            items_status = []
            print('A:', return_items)

            for return_item in return_items:
                print('B:', return_item.inventory_item)
                total_stocks = ItemStock.objects.filter(
                    item=return_item.inventory_item)
                total_qty = total_stocks.aggregate(total_qty=Sum('qty'))
                total_foc = total_stocks.aggregate(total_foc=Sum('foc'))
                print('B:', total_qty)
                if return_item.qty > total_qty['total_qty'] or return_item.foc > total_foc['total_foc']:
                    items_status.append(return_item.inventory_item.item_code)
                    print('C:')

            if len(items_status) > 0:
                return Response(data={"title": f"Not enough stock for {items_status}", "items": items_status}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return_bill.save()
                for return_item in return_items:
                    print('D:')

                    reduceQty = ReduceMRetQuantity(
                        return_item, return_item.inventory_item.id, return_item.whole_sale_price, return_item.retail_price)
                    reduceQty.reduce_qty()
                return Response(status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class DeleteReturn(APIView):
    def delete(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        salesref_return = SalesRefReturn.objects.get(id=item)
        try:
            salesref_return.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AddReturnItem(APIView):

    def post(self, request, *args, **kwargs):
        print('hi1')
        sales_ref_return = SalesRefReturn.objects.get(id=self.kwargs.get('id'))
        return_items = []
        print(request.data['items'])
        try:
            for item in request.data['items']:
                print(item)
                return_items.append(SalesRefReturnItem(salesrefreturn=sales_ref_return,  inventory_item=DistributorInventoryItems.objects.get(
                    id=item['id']), qty=int(item['qty']), foc=int(item['foc']), reason=item['reason'], whole_sale_price=item['whole_sale_price'],
                    retail_price=item['retail_price'],
                    initial_qty=int(item['qty']),
                    initial_foc=int(item['foc'])))
            print(return_items)

            SalesRefReturnItem.objects.bulk_create(return_items)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            sales_ref_return.delete()
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UpdateReturnItem(generics.UpdateAPIView):
    serializer_class = serializers.CreateSalesReturnItemsSerializer
    queryset = SalesRefReturnItem.objects.all()


class DeleteReturnItem(generics.DestroyAPIView):
    serializer_class = serializers.CreateSalesReturnItemsSerializer
    queryset = SalesRefReturnItem.objects.all()


class GetReturnItems(generics.ListAPIView):
    serializer_class = serializers.GetItemsSeraializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        return get_list_or_404(SalesRefReturnItem, salesrefreturn=item)
