from rest_framework import status
from rest_framework.response import Response
from company_invoice.models import CompanyInvoice, CompanyInvoiceItems
from . import serializers
from rest_framework import generics
from django.shortcuts import get_list_or_404
from company_inventory.ReduceQuantity import ReduceQuantity
from company_inventory.models import CompanyInventory


class AddInvoice(generics.CreateAPIView):
    get_serializer = serializers.AddInvoiceSerializer

    def create(self, request, *args, **kwargs):
        last_invoice = CompanyInvoice.objects.all().last()
        invoice_data = request.data['data']['inv']
        print(last_invoice)
        if last_invoice is not None:
            print(last_invoice.invoice_number)
            inv_number = last_invoice.invoice_number+1
            invoice_data['invoice_number'] = inv_number
        else:
            invoice_data['invoice_number'] = 1
        print(invoice_data)
        try:
            serializer = self.get_serializer(data=invoice_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AddInvoiceItems(generics.CreateAPIView):
    def create(self, request, *args, **kwargs):
        invoice = CompanyInvoice.objects.get(id=self.kwargs.get('id'))
        item_obj = []
        inventory_item = []
        try:
            for inv_item in request.data['data']['items']:
                company_item = {}
                item_obj.append(CompanyInvoiceItems(
                    invoice=invoice, item=inv_item['item_code'], qty=inv_item['qty'], foc=inv_item['free_of_charge'], unit_price=inv_item['retail_price'], description=inv_item['description'], whole_price=float(inv_item['retail_price']*int(inv_item['qty']))))
                company_item['item'] = CompanyInventory.objects.get(
                    id=inv_item['id'])
                company_item['qty'] = int(inv_item['qty'])

                inventory_item.append(company_item)
            CompanyInvoiceItems.objects.bulk_create(item_obj)

            for itm in inventory_item:

                reduceInvQty = ReduceQuantity(
                    item=itm['item'], qty=itm['qty'])
                reduceInvQty.reduce_qty()
                return Response({"success": True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            invoice.delete()
            return Response({"success": False, "errors": "item does not exist"}, status=status.HTTP_400_BAD_REQUEST)


class AllInvoices(generics.ListAPIView):
    serializer_class = serializers.GetInvoiceSerializer
    queryset = CompanyInvoice.objects.all()


class GetInvoiceItems(generics.ListAPIView):
    serializer_class = serializers.GetAllInvoiceItems

    def get_queryset(self, *args, **kwargs):
        print(self.kwargs)
        item = self.kwargs.get('id')
        return get_list_or_404(CompanyInvoiceItems, invoice=item)


class DeleteInvoice(generics.DestroyAPIView):
    serializer_class = serializers.AddInvoiceSerializer

    def delete(self, request, *args, **kwargs):
        item = self.kwargs.get('pk')
        invoice = CompanyInvoice.objects.get(id=item)
        items = CompanyInvoiceItems.objects.filter(invoice=invoice)
        try:
            items.delete()
            invoice.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
