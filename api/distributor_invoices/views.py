from rest_framework import status
from rest_framework.response import Response
from distributor_invoice.models import DistributorInvoice, DistributorInvoiceItems
from . import serializers
from rest_framework import generics
from django.shortcuts import get_object_or_404, get_list_or_404


class AddInvoice(generics.CreateAPIView):

    def create(self, request, *args, **kwargs):
        print(request.data)
        invoice_data = request.data['inv']
        invoice_items = request.data['items']
        serializer = serializers.AddInvoiceSerializer(data=invoice_data)
        if serializer.is_valid():
            obj = serializer.save()
            invoice = DistributorInvoice.objects.get(id=obj.id)
            item_obj = []
            try:
                for inv_item in invoice_items:
                    item_obj.append(DistributorInvoiceItems(
                        invoice=invoice, item=inv_item['item_code'], qty=inv_item['qty'], foc=inv_item['free_of_charge'], unit_price=inv_item['retail_price'], description=inv_item['description'], whole_price=float(inv_item['retail_price']*int(inv_item['qty']))))

                DistributorInvoiceItems.objects.bulk_create(item_obj)
                return Response({"success": True}, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                print(invoice)
                invoice.delete()
                return Response({"success": False, "errors": "item does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            print(serializer.errors)
            return Response({"success": False, "errors": "item does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        # return Response(status=status.HTTP_200_OK)


class AllInvoices(generics.ListAPIView):
    serializer_class = serializers.AddInvoiceSerializer
    queryset = DistributorInvoice.objects.all()


class AllDistributorInvoices(generics.ListAPIView):
    serializer_class = serializers.AddInvoiceSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(DistributorInvoice, distributor_inventory=item)


class InvoiceItems(generics.ListAPIView):
    serializer_class = serializers.GetAllInvoiceItems

    def get_queryset(self, *args, **kwargs):
        print(self.kwargs)
        item = self.kwargs.get('id')
        return get_list_or_404(DistributorInvoiceItems, invoice=item)
