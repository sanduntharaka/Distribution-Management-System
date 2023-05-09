from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem
from distrubutor_salesref_invoice.ReduceDistributorQuantity import ReduceQuantity
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventoryItems
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateInvoice(generics.CreateAPIView):
    get_serializer = serializers.CreateInvoiceSerializer
    queryset = SalesRefInvoice.objects.all()

    def create(self, request, *args, **kwargs):
        last_bill = SalesRefInvoice.objects.all().first()
        data = self.request.data
        if last_bill is not None:
            bill_number = last_bill.bill_number
            data['bill_number'] = bill_number+1
        else:
            data['bill_number'] = 1
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # Response(status=status.HTTP_200_OK)


class AllInvoice(generics.ListAPIView):
    serializer_class = serializers.GetInvoicesSerializer
    queryset = SalesRefInvoice.objects.all()


class AllInvoiceBySalesRef(generics.ListAPIView):
    serializer_class = serializers.GetInvoicesSerializer
    queryset = SalesRefInvoice.objects.all()

    def get_queryset(self, *args, **kwargs):
        disti_ref = SalesRefDistributor.objects.get(
            sales_ref=self.kwargs.get('id'))
        return get_list_or_404(SalesRefInvoice, dis_sales_ref=disti_ref)


class AllInvoiceByDistributor(generics.ListAPIView):
    serializer_class = serializers.GetInvoicesSerializer
    queryset = SalesRefInvoice.objects.all()

    def get_queryset(self, *args, **kwargs):
        disti_ref = SalesRefDistributor.objects.get(
            distributor=self.kwargs.get('id'))
        return get_list_or_404(SalesRefInvoice, dis_sales_ref=disti_ref)


class CreateInvoiceItems(generics.CreateAPIView):
    get_serializer = serializers.CreateInvoiceItemsSerializer
    queryset = InvoiceIntem.objects.all()

    def create(self, request, *args, **kwargs):
        bill = SalesRefInvoice.objects.get(id=request.data['bill'])
        item_objs = []
        inventory_items = []
        try:
            for item in request.data['items']:
                dist_item = {}
                item_objs.append(InvoiceIntem(bill=bill, item_code=item['item_code'], description=item['description'], qty=item['qty'],
                                 foc=item['foc'], pack_size=item['pack_size'], price=item['price'], extended_price=item['extended_price']))
                dist_item['item'] = DistributorInventoryItems.objects.get(
                    id=item['id'])
                dist_item['qty'] = item['qty']
                inventory_items.append(dist_item)

            InvoiceIntem.objects.bulk_create(item_objs)

            for inv_item in inventory_items:
                reduceQty = ReduceQuantity(inv_item['item'], inv_item['qty'])
                reduceQty.reduce_qty()
            return Response(status=status.HTTP_201_CREATED)
        except:
            bill.delete()
            return Response(status=status.HTTP_400_BAD_REQUEST)


class InvoiceItems(generics.ListAPIView):
    serializer_class = serializers.CreateInvoiceItemsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(InvoiceIntem, bill=item)
