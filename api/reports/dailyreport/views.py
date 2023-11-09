from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref.models import SalesRefDistributor
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem, Item, PaymentDetails
from salesref_return.models import SalesRefReturn, SalesRefReturnItem
from not_buy_details.models import NotBuyDetails
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from userdetails.models import UserDetails

from dealer_details.models import Dealer
from item_category.models import Category
from reportclasses.daily_report import GenerateDailyReportExcell


class GetDailyReport(APIView):
    def post(self, request):
        print(request.data)
        try:
            date_from = request.data['date_from']
            date_to = request.data['date_to']

            sales_ref = request.data['sales_ref']
            distributor = request.data['distributor']
            users = UserDetails.objects.filter(
                id__in=[sales_ref, distributor]).values('user')
            filters = {}
            filters['dis_sales_ref__sales_ref'] = sales_ref
            filters['date__range'] = (date_from, date_to)

            invoice_list = SalesRefInvoice.objects.filter(
                **filters)
            # dealers = Dealer.objects.filter(
            #     id__in=[i['dealer'] for i in dealer_list])
            # print('dd:', dealers)

            categories = Category.objects.all()

            data = {
                'main_details': {
                    'date': date_from + ' to ' + date_to,
                    'sales_rep': UserDetails.objects.get(id=sales_ref).full_name,
                    'area': UserDetails.objects.get(id=sales_ref).getTerrotories(),
                    'distributor': UserDetails.objects.get(id=distributor).full_name,
                }
            }

            dealer_data = []
            for invoice in invoice_list:
                pay_details = PaymentDetails.objects.filter(
                    bill=invoice, is_completed=False)
                details = {
                    'dealer': invoice.dealer.name,
                    'address': invoice.dealer.address,
                    'amount': invoice.total if invoice.is_settiled is not True else ' ',
                    'since': pay_details.last().bill.date if pay_details.last() is not None and invoice.is_settiled is not True else ' ',
                }

                sales_list = []
                foc_list = []
                market_return = []
                for category in categories:
                    sales_data = {}
                    foc_data = {}
                    market_return_data = {}
                    bill_items = Item.objects.filter(item__item__category=category, invoice_item__bill__dis_sales_ref__sales_ref=sales_ref, invoice_item__bill__date__range=(date_from, date_to), invoice_item__bill=invoice
                                                     )
                    sale_sum = sum(
                        [bil_item.foc+bil_item.qty for bil_item in bill_items])
                    sales_data[category.category_name] = sale_sum if sale_sum > 0 else ' '
                    sales_list.append(sales_data)

                    foc_sum = sum(
                        [bil_item.foc for bil_item in bill_items])
                    foc_data[category.category_name] = foc_sum if foc_sum > 0 else ' '
                    foc_list.append(foc_data)

                    maket_return_items = SalesRefReturnItem.objects.filter(
                        item__item__category=category, salesrefreturn__dis_sales_ref__sales_ref=sales_ref, salesrefreturn__date__range=(date_from, date_to), salesrefreturn__dealer=invoice.dealer)

                    mret_sum = sum(
                        [mk_item.foc+mk_item.qty for mk_item in maket_return_items])
                    market_return_data[category.category_name] = mret_sum if mret_sum > 0 else ' '

                    market_return.append(market_return_data)

                details['sales'] = sales_list
                details['foc'] = foc_list
                details['market_return'] = market_return
                cash = []
                cheque = []
                credit = []
                for pay in pay_details:
                    if pay.payment_type == 'cash':
                        cash.append(pay.paid_amount)
                    if pay.payment_type == 'cheque':
                        cheque.append(pay.paid_amount)
                    if pay.payment_type == 'credit':
                        credit.append(pay.paid_amount)
                    if pay.payment_type == 'cash-credit':
                        cash.append(pay.paid_amount)
                        credit.append(pay.bill.total - sum(cash))
                    if pay.payment_type == 'cash-cheque':
                        cash.append(pay.paid_amount-pay.get_cheque_amount())
                        cheque.append(pay.get_cheque_amount())
                    if pay.payment_type == 'cash-credit-cheque':
                        cash.append(pay.paid_amount-pay.get_cheque_amount())
                        cheque.append(pay.get_cheque_amount())
                        credit.append(pay.bill.total - (sum(cash)+sum(cheque)))
                details['cash'] = sum(cash)
                details['cheque'] = sum(cheque)
                details['credit'] = sum(credit)

                dealer_data.append(details)
            data['category_details'] = dealer_data
            # print(data)
            file_genearte = GenerateDailyReportExcell(data)

            return file_genearte.generate()
            # return Response(data='c', status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
