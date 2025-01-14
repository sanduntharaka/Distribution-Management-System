from users.models import UserAccount
from userdetails.models import UserDetails
from distrubutor_salesref.models import SalesRefDistributor
from rest_framework import status
from rest_framework.response import Response
from sales_return.models import SalesReturn, SalesReturnItem
from distributor_inventory.models import DistributorInventoryItems, DistributorInventory, ItemStock
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404
from rest_framework.views import APIView
from dealer_details.models import Dealer


class AddReturn(generics.CreateAPIView):
    get_serializer = serializers.AddReturnSerializer

    def create(self, request, *args, **kwargs):
        last_bill = SalesReturn.objects.all().last()
        data = self.request.data

        terriotory = UserDetails.objects.get(
            id=data['added_by']).getTerrotoriesList()
        data['bill_code'] = 'SRET' + \
            terriotory[0][:3].upper()
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
    queryset = SalesReturn.objects.all()


class GetReturnsByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        queryset = SalesReturn.objects.filter(
            dis_sales_ref__distributor=item)
        queryset = queryset.order_by('-bill_number')
        return get_list_or_404(queryset)


class GetReturnsByDSalesref(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        queryset = SalesReturn.objects.filter(
            dis_sales_ref__sales_ref=item)
        queryset = queryset.order_by('-bill_number')
        return get_list_or_404(queryset)


class GetReturnsByOthers(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        queryset = SalesReturn.objects.filter(
            dis_sales_ref__distributor=item)
        queryset = queryset.order_by('-bill_number')
        return get_list_or_404(queryset)


class GetReturn(generics.RetrieveAPIView):
    serializer_class = serializers.GetReturnsSerializer
    queryset = SalesReturn.objects.all()


class GetPendingReturns(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self):
        queryset = SalesReturn.objects.filter(
            status='pending')
        queryset = queryset.order_by('-bill_number')
        return get_list_or_404(queryset)


class GetPendingReturnsByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetReturnsSerializer

    def get_queryset(self, *args, **kwargs):
        disti_refs = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).values('id')
        distributorsrf_ids = [distributor['id']
                              for distributor in disti_refs]
        queryset = SalesReturn.objects.filter(
            status='pending', dis_sales_ref__in=distributorsrf_ids)
        queryset = queryset.order_by('-bill_number')
        return get_list_or_404(queryset)


class UpdateStatusPendingReturns(generics.UpdateAPIView):
    serializer_class = serializers.UpdateReturnStatusSerializer

    def update(self, request, *args, **kwargs):
        item = self.kwargs.get('pk')
        return_bill = SalesReturn.objects.get(id=item)
        if request.data['status'] == 'approved':
            return_items = SalesReturnItem.objects.filter(
                salesreturn=return_bill)
            if request.data['is_deduct_qty']:
                for i in return_items:
                    # i.item.qty = i.item.qty+(i.qty+i.foc)
                    # i.item.foc = i.item.foc+i.foc
                    # i.item.save()
                    related_stock = ItemStock.objects.filter(
                        item=i.inventory_item).first()
                    stock = ItemStock(item=i.inventory_item,
                                      invoice_number=i.salesreturn.getbillnumber(),
                                      from_sales_return=True,
                                      qty=i.qty+i.foc,
                                      pack_size=related_stock.pack_size,
                                      foc=i.foc,
                                      whole_sale_price=i.whole_sale_price,
                                      retail_price=i.retail_price,
                                      added_by=self.request.user,
                                      )
                    stock.save()

            return_bill.status = request.data['status']
            return_bill.save()
            return Response(status=status.HTTP_200_OK)
        else:
            try:
                return_bill.status = request.data['status']
                return_bill.save()
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response(status=status.HTTP_400_BAD_REQUEST)


class DeleteReturn(APIView):
    def delete(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        salesref_return = SalesReturn.objects.get(id=item)
        try:
            salesref_return.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AddReturnItem(APIView):

    def post(self, request, *args, **kwargs):
        print('hi')
        sales_return = SalesReturn.objects.get(id=self.kwargs.get('id'))
        return_items = []
        try:
            for item in request.data['items']:

                return_items.append(SalesReturnItem(salesreturn=sales_return, inventory_item=DistributorInventoryItems.objects.get(
                    id=item['id']), qty=int(item['qty']), foc=int(item['foc']), reason=item['reason'], whole_sale_price=item['whole_sale_price'],
                    retail_price=item['retail_price'],
                    initial_qty=int(item['qty']),
                    initial_foc=int(item['foc'])))

            SalesReturnItem.objects.bulk_create(return_items)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            sales_return.delete()
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UpdateReturnItem(generics.UpdateAPIView):
    serializer_class = serializers.CreateSalesReturnItemsSerializer
    queryset = SalesReturnItem.objects.all()


class DeleteReturnItem(generics.DestroyAPIView):
    serializer_class = serializers.CreateSalesReturnItemsSerializer
    queryset = SalesReturnItem.objects.all()


class GetReturnItems(generics.ListAPIView):
    serializer_class = serializers.GetItemsSeraializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        return get_list_or_404(SalesReturnItem, salesreturn=item)
