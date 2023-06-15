from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem, ChequeDetails, PaymentDetails
from distrubutor_salesref_invoice.ReduceDistributorQuantity import ReduceQuantity
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventoryItems
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateInvoice(generics.CreateAPIView):
    get_serializer = serializers.CreateInvoiceSerializer

    def create(self, request, *args, **kwargs):

        last_bill = SalesRefInvoice.objects.all().last()
        data = self.request.data
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

    def get_queryset(self, *args, **kwargs):
        return get_list_or_404(SalesRefInvoice, dis_sales_ref__distributor=self.kwargs.get('id'))


class AllPendingInvoice(generics.ListAPIView):
    serializer_class = serializers.GetInvoicesSerializer

    def get_queryset(self, *args, **kwargs):
        disti_refs = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).values('id')

        distributorsrf_ids = [distributor['id']
                              for distributor in disti_refs]
        return get_list_or_404(SalesRefInvoice, status='pending', is_settiled=False, dis_sales_ref__in=distributorsrf_ids)


class AllCreditInvoice(generics.ListAPIView):
    serializer_class = serializers.GetInvoiceWithPaymentSerializer

    def get_queryset(self, *args, **kwargs):
        disti_refs = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).values('id')

        distributorsrf_ids = [distributor['id']
                              for distributor in disti_refs]
        return get_list_or_404(SalesRefInvoice, status='confirmed', is_settiled=False, dis_sales_ref__in=distributorsrf_ids)


class CreateInvoicePayment(generics.CreateAPIView):
    serializer_class = serializers.CreateInvoicePaymentSerializer
    queryset = PaymentDetails.objects.all()


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
                dist_item['item'] = DistributorInventoryItems.objects.get(
                    id=item['id'])
                item_objs.append(InvoiceIntem(bill=bill, item_code=item['item_code'], description=item['description'], qty=item['qty'],
                                 foc=item['foc'], pack_size=item['pack_size'], price=item['price'], extended_price=item['extended_price'], discount=item['discount'], item=dist_item['item']))

                dist_item['qty'] = item['qty']
                dist_item['foc'] = item['foc']
                inventory_items.append(dist_item)

            InvoiceIntem.objects.bulk_create(item_objs)

            for inv_item in inventory_items:
                reduceQty = ReduceQuantity(
                    inv_item['item'], inv_item['qty'], inv_item['foc'])
                reduceQty.reduce_qty()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            bill.delete()
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class InvoiceItems(generics.ListAPIView):
    serializer_class = serializers.GetInvoiceItemsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')
        return get_list_or_404(InvoiceIntem, bill=item)


class AddChequeDetails(generics.CreateAPIView):
    queryset = ChequeDetails.objects.all()
    serializer_class = serializers.AddChequeDetailsSerialzer


class GetChequeDetails(generics.RetrieveAPIView):
    serializer_class = serializers.AddChequeDetailsSerialzer

    def get_object(self, *args, **kwargs):

        item = self.kwargs.get('id')
        return get_object_or_404(ChequeDetails, bill=item)


class ConfirmInvoice(generics.UpdateAPIView):
    serializer_class = serializers.ChangeStatusInvoiceSerializer

    def update(self, request, *args, **kwargs):
        try:
            cof_status = request.data
            print(cof_status)
            payment_type = cof_status['payment_type']
            confirm_status = cof_status['status']
            bill = SalesRefInvoice.objects.get(id=self.kwargs.get('pk'))
            payment_details = {
                'bill': self.kwargs.get('pk'),
                'payment_type': payment_type,
                'paid_amount': float(cof_status['paid_amount']),
                'date': cof_status['date'],
                'added_by': cof_status['added_by'],
                'due_date': cof_status['due_date']
            }
            if confirm_status == 'confirmed':
                bill.status = 'confirmed'
                bill.confirmed_date = cof_status['confirmed_date']
                if bill.total - float(cof_status['paid_amount']) == 0:
                    bill.is_settiled = True
                else:
                    bill.is_settiled = False
                bill.save()
                payment_serializer = serializers.CreateInvoicePaymentSerializer(
                    data=payment_details)

                if payment_serializer.is_valid():
                    p_s = payment_serializer.save()
                    saved_id = p_s.id
                    if payment_type == 'cheque' or payment_type == 'cash-cheque' or payment_type == 'cheque-credit' or payment_type == 'cash-credit-cheque':
                        cheque_details = {
                            'payment_details': saved_id,
                            'number_of_dates': cof_status['number_of_dates'],
                            'cheque_number': cof_status['cheque_number'],
                            'account_number': cof_status['account_number'],
                            'payee_name': cof_status['payee_name'],
                            'bank': cof_status['bank'],
                            'amount': cof_status['amount'],
                            'date': cof_status['date'],
                            'deposited_at': cof_status['deposited_at'],
                            'status': cof_status['cheque_status'],
                            'added_by': cof_status['added_by'],
                        }
                        print(cheque_details)
                        cheque_serializer = serializers.AddChequeDetailsSerialzer(
                            data=cheque_details)
                        if cheque_serializer.is_valid():
                            cheque_serializer.save()
                            return Response(status=status.HTTP_201_CREATED)

                        else:
                            print(cheque_serializer.errors)
                            return Response(status=status.HTTP_400_BAD_REQUEST)
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    print(payment_serializer.errors)

                    return Response(status=status.HTTP_400_BAD_REQUEST)

            if confirm_status == 'rejected':
                bill.status = 'rejected'
                bill.confirmed_date = cof_status['confirmed_date']
                bill.is_settiled = False
                bill.save()
                payment_serializer = serializers.CreateInvoicePaymentSerializer(
                    data=payment_details)
                if payment_serializer.is_valid():
                    p_s = payment_serializer.save()
                    saved_id = p_s.id
                    if payment_type == 'cheque' or payment_type == 'cash-cheque' or payment_type == 'cheque-credit' or payment_type == 'cash-credit-cheque':
                        cheque_details = {
                            'payment_details': saved_id,
                            'number_of_dates': cof_status['number_of_dates'],
                            'cheque_number': cof_status['cheque_number'],
                            'account_number': cof_status['account_number'],
                            'payee_name': cof_status['payee_name'],
                            'bank': cof_status['bank'],
                            'amount': cof_status['amount'],
                            'date': cof_status['date'],
                            'deposited_at': cof_status['deposited_at'],
                            'status': cof_status['cheque_status'],
                            'added_by': cof_status['added_by'],
                        }
                        cheque_serializer = serializers.AddChequeDetailsSerialzer(
                            data=cheque_details)
                        if cheque_serializer.is_valid():
                            cheque_serializer.save()
                            return Response(status=status.HTTP_201_CREATED)

                        else:
                            print(cheque_serializer.errors)
                            return Response(status=status.HTTP_400_BAD_REQUEST)
                    return Response(status=status.HTTP_201_CREATED)

                else:
                    print(payment_serializer.errors)
                    return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AddCredit(generics.UpdateAPIView):
    serializer_class = serializers.CreateInvoicePaymentSerializer

    def update(self, request, *args, **kwargs):
        cof_status = request.data
        payment_type = cof_status['payment_type']
        payment_details = {
            'bill': self.kwargs.get('pk'),
            'payment_type': payment_type,
            'paid_amount': float(cof_status['paid_amount']),
            'date': cof_status['date'],
            'due_date': cof_status['due_date'],
            'added_by': cof_status['added_by'],
        }
        payment_serializer = serializers.CreateInvoicePaymentSerializer(
            data=payment_details)
        if payment_serializer.is_valid():
            p_s = payment_serializer.save()
            saved_id = p_s.id
            if payment_type == 'cheque' or payment_type == 'cash-cheque' or payment_type == 'cheque-credit' or payment_type == 'cash-credit-cheque':
                cheque_details = {
                    'payment_details': saved_id,
                    'number_of_dates': cof_status['number_of_dates'],
                    'cheque_number': cof_status['cheque_number'],
                    'account_number': cof_status['account_number'],
                    'payee_name': cof_status['payee_name'],
                    'bank': cof_status['bank'],
                    'amount': cof_status['amount'],
                    'date': cof_status['date'],
                    'deposited_at': cof_status['deposited_at'],
                    'status': cof_status['cheque_status'],
                    'added_by': cof_status['added_by'],
                }
                cheque_serializer = serializers.AddChequeDetailsSerialzer(
                    data=cheque_details)
                if cheque_serializer.is_valid():
                    cheque_serializer.save()
                    return Response(status=status.HTTP_201_CREATED)

                else:
                    print(cheque_serializer.errors)
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(payment_serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ConfirmCheque(generics.UpdateAPIView):
    queryset = ChequeDetails.objects.all()
    serializer_class = serializers.ChangeStatusChequeSerializer


class InvoiceItemUpdate(APIView):
    def put(self, request, *args, **kwargs):
        print(request.data)
        item = {
            'bill': request.data['bill'],
            'item': request.data['item'],
            'discount': float(request.data['discount']),
            'item_code': request.data['item_code'],
            'description': request.data['description'],
            'qty': float(request.data['qty']),
            'foc': float(request.data['foc']),
            'pack_size': request.data['pack_size'],
        }
        item['extended_price'] = int(
            item['qty'])*float(request.data['retail_price'])
        item['price'] = float(request.data['retail_price'])

        bill = SalesRefInvoice.objects.get(id=request.data['bill'])
        invoice_item = InvoiceIntem.objects.get(id=request.data['id'])

        if invoice_item.qty > item['qty']:
            print('over')
            dis = 0
            if invoice_item.discount > item['discount']:
                dis = item['discount'] - invoice_item.discount
                print('od')
            elif invoice_item.discount < item['discount']:
                dis = item['qty'] * item['discount'] - invoice_item.discount
            sub_tot = item['extended_price'] - invoice_item.extended_price
            bill.change_total(sub_tot, dis)

        else:
            print('less')
            dis = 0
            if invoice_item.discount > item['discount']:
                dis = item['discount'] - invoice_item.discount
                print('od')
            elif invoice_item.discount < item['discount']:
                dis = item['qty'] * item['discount'] - invoice_item.discount
            sub_tot = item['extended_price'] - invoice_item.extended_price
            bill.change_total(sub_tot, dis)

        serializer = serializers.CreateInvoiceItemsSerializer(
            data=item, instance=invoice_item)
        if serializer.is_valid():
            serializer.save()
            bill.save()
            return Response(status=status.HTTP_200_OK)
        else:
            print('invalid')
            print(serializer.errors)

            return Response(status=status.HTTP_400_BAD_REQUEST)


class InvoiceItemDelete(APIView):
    def delete(self, request, *args, **kwargs):
        bill = SalesRefInvoice.objects.get(id=request.data['bill'])
        invoice_item = InvoiceIntem.objects.get(id=request.data['id'])
        dis = invoice_item.discount
        sub_tot = -(invoice_item.extended_price)

        bill.change_total(sub_tot, dis)
        try:
            invoice_item.delete()
            bill.save()
            return Response(status=status.HTTP_200_OK)

        except:

            return Response(status=status.HTTP_400_BAD_REQUEST)


class AllInvoiceByDealer(APIView):
    def get(self, request, *args, **kwargs):
        item = self.kwargs.get('id')

        invoices = SalesRefInvoice.objects.filter(dealer=item)
        serializer = serializers.GetDealerInvoiceSerializer(
            invoices, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class AllInvoicePayments(generics.ListAPIView):
    serializer_class = serializers.GetPaymentDetailsSerializer

    def get_queryset(self, *args, **kwargs):
        item = self.kwargs.get('id')

        return get_list_or_404(PaymentDetails, bill=item)
