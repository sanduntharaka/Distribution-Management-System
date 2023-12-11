from distrubutor_salesref_invoice.EditBillItems import EditBillItems
from distrubutor_salesref_invoice.DeleteBillItems import DeleteBillItems
from rest_framework.permissions import IsAuthenticated
import jwt
from rest_framework import filters
from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem, ChequeDetails, PaymentDetails, Item
from distrubutor_salesref_invoice.ReduceDistributorQuantity import ReduceQuantity
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventoryItems, ItemStock
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from django.db import transaction
from dealer_details.models import Dealer
from userdetails.models import UserDetails


class CreateInvoice(generics.CreateAPIView):
    serializer_class = serializers.CreateInvoiceSerializer

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                last_bill = SalesRefInvoice.objects.filter(
                    inventory=request.data['inventory']).last()

                data = request.data
                data['total'] = data['sub_total'] - data['total_discount']
                if last_bill is not None:
                    bill_number = last_bill.bill_number
                    data['bill_number'] = bill_number + 1
                else:
                    data['bill_number'] = 1

                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)

                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            error_message = str(e)
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

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
        distributor_id = self.kwargs.get('id')

        # Filter the invoices for the given distributor
        queryset = SalesRefInvoice.objects.filter(
            dis_sales_ref__distributor=distributor_id)

        # Order the queryset by date and time
        queryset = queryset.order_by('-bill_number')

        # Use get_list_or_404 to return the ordered queryset
        return get_list_or_404(queryset)


class AllInvoiceByOthers_Distributor(generics.ListAPIView):
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

        queryset = SalesRefInvoice.objects.filter(
            status='pending', is_settiled=False, dis_sales_ref__in=distributorsrf_ids)
        queryset = queryset.order_by('-date', '-time')
        return get_list_or_404(queryset)


class AllPendingInvoiceByOthers(generics.ListAPIView):
    serializer_class = serializers.GetInvoicesSerializer

    def get_queryset(self, *args, **kwargs):
        disti_refs = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).values('id')

        distributorsrf_ids = [distributor['id']
                              for distributor in disti_refs]
        queryset = SalesRefInvoice.objects.filter(
            status='pending', is_settiled=False, dis_sales_ref__in=distributorsrf_ids)
        queryset = queryset.order_by('-date', '-time')
        return get_list_or_404(queryset)


class AllCreditInvoice(generics.ListAPIView):
    serializer_class = serializers.GetInvoiceWithPaymentSerializer

    def get_queryset(self, *args, **kwargs):
        disti_refs = SalesRefDistributor.objects.filter(
            distributor=self.kwargs.get('id')).values('id')

        distributorsrf_ids = [distributor['id']
                              for distributor in disti_refs]

        return get_list_or_404(SalesRefInvoice, status='confirmed', is_settiled=False, dis_sales_ref__in=distributorsrf_ids)


class AllCreditInvoiceByOthers(generics.ListAPIView):
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
                # dist_item = {}
                # dist_item['item'] = ItemStock.objects.get(
                #     id=item['id'])
                invoice_item = InvoiceIntem(bill=bill, item_code=item['item_code'], description=item['description'], qty=item['qty'],
                                            foc=item['foc'], price=item['price'], whole_sale_price=item['whole_sale_price'], extended_price=item['extended_price'], discount=item['discount'])

                # dist_item['qty'] = item['qty']
                # dist_item['foc'] = item['foc']
                invoice_item.save()
                print('calling1')
                reduceQty = ReduceQuantity(
                    invoice_item, item['id'], item['whole_sale_price'], item['price'])
                reduceQty.reduce_qty()
            #     inventory_items.append(dist_item)
            # InvoiceIntem.objects.bulk_create(item_objs)

            # for inv_item in inventory_items:
            #     reduceQty = ReduceQuantity(
            #         inv_item['item'], inv_item['qty'], inv_item['foc'])
            #     reduceQty.reduce_qty()
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            bill.delete()
            print('err:', e)
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
            bill = SalesRefInvoice.objects.get(id=self.kwargs.get('pk'))
            confirm_status = cof_status['status']
            if confirm_status == 'confirmed':
                payment_type = cof_status['payment_type']
                cheque_amount = float(
                    cof_status['amount']) if payment_type == 'cheque' or payment_type == 'cash-cheque' or payment_type == 'cheque-credit' or payment_type == 'cash-credit-cheque' else 0
                payment_details = {
                    'bill': self.kwargs.get('pk'),
                    'payment_type': payment_type,
                    'paid_amount': float(cof_status['paid_amount'])+cheque_amount,
                    'date': cof_status['date'],
                    'added_by': cof_status['added_by'],
                    'due_date': cof_status['due_date'],
                    'is_completed': False if payment_type == 'cheque' or payment_type == 'cash-cheque' or payment_type == 'cheque-credit' or payment_type == 'cash-credit-cheque' else True
                }

                bill.status = 'confirmed'
                bill.confirmed_date = cof_status['confirmed_date']

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
                            'branch': cof_status['branch'],
                            'payee_name': cof_status['payee_name'],
                            'bank': cof_status['bank'],
                            'amount': cof_status['amount'],
                            'date': cof_status['cheque_date'],
                            'deposited_at': cof_status['deposited_at'],
                            'status': cof_status['cheque_status'],
                            'added_by': cof_status['added_by'],

                        }

                        cheque_serializer = serializers.AddChequeDetailsSerialzer(
                            data=cheque_details)
                        if cheque_serializer.is_valid():

                            bill.save()
                            cheque_serializer.save()
                            return Response(status=status.HTTP_201_CREATED)

                        else:

                            PaymentDetails.objects.get(id=saved_id).delete()

                            print('c:', cheque_serializer.errors)
                            return Response(status=status.HTTP_400_BAD_REQUEST)

                    bill.save()

                    bill = PaymentDetails.objects.get(id=saved_id).bill
                    if bill.get_payed() == bill.total:
                        bill.is_settiled = True
                        bill.save()

                    return Response(status=status.HTTP_201_CREATED)
                else:

                    print('ps:', payment_serializer.errors)

                    return Response(status=status.HTTP_400_BAD_REQUEST)

            if confirm_status == 'rejected':
                bill.status = 'rejected'
                bill.confirmed_date = cof_status['confirmed_date']
                bill.rejected_reason = cof_status['rejected_reason']
                bill.is_settiled = False
                bill.save()
                invoice_items = InvoiceIntem.objects.filter(bill=bill.id)
                for item in invoice_items:
                    reduce_qty = ReduceQuantity(
                        item=item.item, qty=item.qty, foc=item.foc)
                    reduce_qty.deleted_details()

                return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AddCredit(generics.UpdateAPIView):
    serializer_class = serializers.CreateInvoicePaymentSerializer

    def update(self, request, *args, **kwargs):
        cof_status = request.data
        payment_type = cof_status['payment_type']
        cheque_amount = float(
            cof_status['amount']) if payment_type == 'cheque' or payment_type == 'cash-cheque' or payment_type == 'cheque-credit' or payment_type == 'cash-credit-cheque' else 0
        payment_details = {
            'bill': self.kwargs.get('pk'),
            'payment_type': payment_type,
            'paid_amount': float(cof_status['paid_amount']) + cheque_amount,
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
                    'branch': cof_status['branch'],
                    'payee_name': cof_status['payee_name'],
                    'bank': cof_status['bank'],
                    'amount': cof_status['amount'],
                    'date': cof_status['cheque_date'],
                    'deposited_at': cof_status['deposited_at'],
                    'status': cof_status['cheque_status'],
                    'added_by': cof_status['added_by'],
                }
                cheque_serializer = serializers.AddChequeDetailsSerialzer(
                    data=cheque_details)
                if cheque_serializer.is_valid():
                    cheque_serializer.save()
                    pay_details = PaymentDetails.objects.get(id=saved_id)
                    pay_details.is_completed = False
                    pay_details.save()
                    return Response(status=status.HTTP_201_CREATED)

                else:
                    print(cheque_serializer.errors)
                    PaymentDetails.objects.get(id=saved_id).delete()
                    return Response(status=status.HTTP_400_BAD_REQUEST)

            bill = PaymentDetails.objects.get(id=saved_id).bill

            if bill.get_payed() == bill.total:
                bill.is_settiled = True
                bill.save()

            return Response(status=status.HTTP_201_CREATED)
        else:
            print(payment_serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ConfirmCheque(generics.UpdateAPIView):
    queryset = ChequeDetails.objects.all()
    serializer_class = serializers.ChangeStatusChequeSerializer


class ReturnCheque(generics.UpdateAPIView):
    serializer_class = serializers.ChangeStatusChequeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        if not request.user.is_distributor:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:

            cheque = ChequeDetails.objects.get(
                cheque_number=request.data['cheque_number'])
            if cheque.status != 'return':
                cheque.status = 'return'
                cheque.save()

                bill = cheque.payment_details
                bill.paid_amount = bill.paid_amount - cheque.amount
                bill.is_completed = False
                bill.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Cheque is alredy returned.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)

            return Response({'error': 'Cannot save cheque as return. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)


class InvoiceItemUpdate(APIView):
    def put(self, request, *args, **kwargs):

        item_request = {
            'discount': float(request.data['discount']),
            'qty': float(request.data['qty']),
            'foc': float(request.data['foc']),
            'extended_price': float(request.data['extended_price']),

        }
        print(item_request)
        invoice_item = InvoiceIntem.objects.get(id=request.data['id'])
        prev_qty = invoice_item.qty
        prev_foc = invoice_item.foc

        items = Item.objects.filter(invoice_item=invoice_item)
        total_prev_qty = prev_qty+prev_foc
        total_requested_qty = item_request['qty']+item_request['foc']

        discount_changed = invoice_item.discount - item_request['discount']

        invoice_item.discount = item_request['discount'] if invoice_item.discount == float(
            0) else invoice_item.discount - discount_changed
        invoice_item.bill.total_discount = item_request['discount'] if invoice_item.bill.total_discount == float(
            0) else invoice_item.bill.total_discount - discount_changed
        invoice_item.bill.total = invoice_item.bill.total - \
            item_request['discount'] if invoice_item.bill.total_discount == float(
                0) else invoice_item.bill.total + discount_changed
        invoice_item.bill.save()
        invoice_item.save()

        """
        to_add_qty means add to stocks
        to_remove_qty means remove from stocks
        """

        if total_prev_qty > total_requested_qty:
            """Items removed from Invoice Items"""
            """Add removed items to inventory"""
            try:
                to_add_qty = prev_qty-item_request['qty']
                to_add_foc = prev_foc-item_request['foc']
                print('prev_add:', prev_foc)

                print('to_add:', to_add_foc)
                removed_qty = to_add_qty
                removed_foc = to_add_foc

                for item in items:
                    if to_add_qty > item.qty:
                        item.item.qty = item.item.qty+item.qty
                        to_add_qty = to_add_qty - item.qty
                        item.qty = 0
                    else:
                        item.item.qty = item.item.qty+to_add_qty
                        item.qty = item.qty-to_add_qty
                        to_add_qty = 0

                    if to_add_foc > item.foc:
                        if item.foc == 0:
                            print('1')
                            item.item.qty = item.item.qty+to_add_foc
                            to_add_foc = to_add_foc - to_add_foc
                            # must cheque
                            # if item.item.initial_foc != 0:
                            #     item.item.foc = item.item.foc+to_add_foc
                        else:
                            item.item.qty = item.item.qty+item.foc
                            to_add_foc = to_add_foc - item.foc
                        item.foc = 0
                    else:
                        print('2')

                        item.item.qty = item.item.qty+to_add_foc

                        item.foc = item.foc-to_add_foc
                        to_add_foc = 0

                    item.item.save()
                    item.save()

                    if to_add_qty == 0:

                        break
                invoice_item.qty = (item_request['qty'])
                invoice_item.foc = (item_request['foc'])
                invoice_item.save()
                if invoice_item.bill.billing_price_method == '2':

                    invoice_item.extended_price = invoice_item.qty * invoice_item.price
                    invoice_item.bill.total = invoice_item.bill.total - \
                        (removed_qty * invoice_item.price)
                    invoice_item.bill.sub_total = invoice_item.bill.sub_total - \
                        (removed_qty * invoice_item.price)

                else:
                    invoice_item.extended_price = invoice_item.qty * invoice_item.whole_sale_price
                    invoice_item.bill.total = invoice_item.bill.total - \
                        (removed_qty * invoice_item.whole_sale_price)
                    invoice_item.bill.sub_total = invoice_item.bill.sub_total - \
                        (removed_qty * invoice_item.whole_sale_price)
                invoice_item.bill.save()
                invoice_item.save()

                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response(status=status.HTTP_400_BAD_REQUEST)

        else:
            to_remove_qty = item_request['qty'] - prev_qty
            to_remove_foc = item_request['foc'] - prev_foc
            try:
                reduce_qty = EditBillItems(invoice_item.item_code, invoice_item.whole_sale_price,
                                           invoice_item.price, to_remove_qty, to_remove_foc, invoice_item)
                reduce_qty.reduce_qty()
                invoice_item.qty = invoice_item.qty + to_remove_qty
                invoice_item.foc = invoice_item.foc + to_remove_foc
                invoice_item.save()
                if invoice_item.bill.billing_price_method == '2':

                    invoice_item.extended_price = invoice_item.qty * invoice_item.price
                    invoice_item.bill.total = invoice_item.bill.total + \
                        (to_remove_qty * invoice_item.price)
                    invoice_item.bill.sub_total = invoice_item.bill.sub_total + \
                        (to_remove_qty * invoice_item.price)

                else:
                    invoice_item.extended_price = invoice_item.qty * invoice_item.whole_sale_price
                    invoice_item.bill.total = invoice_item.bill.total + \
                        (to_remove_qty * invoice_item.whole_sale_price)
                    invoice_item.bill.sub_total = invoice_item.bill.sub_total + \
                        (to_remove_qty * invoice_item.whole_sale_price)

                invoice_item.bill.save()
                invoice_item.save()

                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response(status=status.HTTP_400_BAD_REQUEST)

        # if invoice_item.qty > item['qty']:

        #     dis = 0
        #     if invoice_item.discount > item['discount']:
        #         dis = item['discount'] - invoice_item.discount

        #     elif invoice_item.discount < item['discount']:
        #         dis = item['qty'] * item['discount'] - invoice_item.discount
        #     sub_tot = item['extended_price'] - invoice_item.extended_price
        #     bill.change_total(sub_tot, dis)

        # else:

        #     dis = 0
        #     if invoice_item.discount > item['discount']:
        #         dis = item['discount'] - invoice_item.discount

        #     elif invoice_item.discount < item['discount']:
        #         dis = item['qty'] * item['discount'] - invoice_item.discount
        #     sub_tot = item['extended_price'] - invoice_item.extended_price
        #     bill.change_total(sub_tot, dis)

        # serializer = serializers.UpdateInvoiceItemsSerializer(
        #     data=item, instance=invoice_item)
        # if serializer.is_valid():
        #     serializer.save()
        #     bill.save()
        #     reduce_qty = ReduceQuantity(
        #         item=invoice_item.item, qty=item['qty'], foc=item['foc'])
        #     reduce_qty.edited_details(
        #         prev_qty=prev_qty, prev_foc=prev_foc)
        #     return Response(status=status.HTTP_200_OK)
        # else:
        #     print(serializer.errors)
        #     return Response(status=status.HTTP_400_BAD_REQUEST)


class InvoiceItemDelete(APIView):
    def delete(self, request, *args, **kwargs):

        bill = SalesRefInvoice.objects.get(id=request.data['bill'])
        invoice_item = InvoiceIntem.objects.get(id=request.data['id'])

        print(request)
        dis = invoice_item.discount
        sub_tot = -(invoice_item.extended_price)

        bill.change_total(sub_tot, dis)
        reduce_qty = DeleteBillItems(
            invoice_item=invoice_item)

        try:
            invoice_item.delete()
            bill.save()
            reduce_qty.delete()
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


class GetInvoicePaymentDetail(generics.RetrieveAPIView):
    serializer_class = serializers.GetPaymentDetailsSerializer
    queryset = PaymentDetails.objects.all()


class GetInvoicePaymentCheque(generics.RetrieveAPIView):
    serializer_class = serializers.AddChequeDetailsSerialzer
    queryset = ChequeDetails.objects.all()


class ConfirmCheque(generics.UpdateAPIView):
    serializer_class = serializers.ConfirmChequeDetailsSerialzer
    queryset = ChequeDetails.objects.all()


class EditCheque(generics.UpdateAPIView):
    serializer_class = serializers.EditChequeDetailsSerialzer
    queryset = ChequeDetails.objects.all()


class DeleteInvoicePayment(generics.DestroyAPIView):
    serializer_class = serializers.CreateInvoicePaymentSerializer

    def delete(self, request, *args, **kwargs):
        item = self.kwargs.get('pk')

        payment_details = PaymentDetails.objects.get(id=item)
        try:
            cheque_details = ChequeDetails.objects.get(
                payment_details=payment_details)
            cheque_details.delete()

        except ChequeDetails.DoesNotExist:
            pass
        payment_details.delete()

        return Response(status=status.HTTP_200_OK)


class GetCheque(generics.ListAPIView):
    serializer_class = serializers.GetChequeDetailsSerialzer
    # queryset = Dealer.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ('cheque_number',)

    def get_queryset(self):
        request = self.request
        user = request.user.id
        return ChequeDetails.objects.filter(added_by__user=user)
