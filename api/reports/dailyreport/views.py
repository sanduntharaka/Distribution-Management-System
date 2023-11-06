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

            dealers = Dealer.objects.filter(
                added_by__in=[i['user'] for i in users])

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
            for dealer in dealers:
                pay_details = PaymentDetails.objects.filter(
                    bill__dealer=dealer, is_completed=False, bill__dis_sales_ref__sales_ref=sales_ref)
                total_amount = sum(
                    [pay.bill.total - pay.paid_amount for pay in pay_details])
                details = {
                    'dealer': dealer.name,
                    'address': dealer.address,
                    'amount': total_amount,
                    'since': pay_details.first().date if pay_details.first() is not None else ' ',
                }
                sales_list = []
                foc_list = []
                market_return = []
                for category in categories:
                    sales_data = {}
                    foc_data = {}
                    market_return_data = {}
                    bill_items = Item.objects.filter(item__item__category=category, invoice_item__bill__dis_sales_ref__sales_ref=sales_ref, invoice_item__bill__date__range=(date_from, date_to), invoice_item__bill__dealer=dealer
                                                     )

                    sales_data[category.category_name] = sum(
                        [bil_item.foc+bil_item.qty for bil_item in bill_items])
                    sales_list.append(sales_data)

                    foc_data[category.category_name] = sum(
                        [bil_item.foc for bil_item in bill_items])
                    foc_list.append(foc_data)

                    maket_return_items = SalesRefReturnItem.objects.filter(
                        item__item__category=category, salesrefreturn__dis_sales_ref__sales_ref=sales_ref, salesrefreturn__date__range=(date_from, date_to), salesrefreturn__dealer=dealer)
                    market_return_data[category.category_name] = sum(
                        [mk_item.foc+mk_item.qty for mk_item in maket_return_items])

                    market_return.append(market_return_data)

                details['sales'] = sales_list
                details['foc'] = foc_list
                details['market_return'] = market_return
                details['cash'] = sum([pay.total for pay in pay_details.filter(
                    date__range=(date_from, date_to)) if pay.payment_type == 'cash'])
                details['cheque'] = sum([pay.total for pay in pay_details.filter(
                    date__range=(date_from, date_to)) if pay.payment_type == 'cheque'])
                details['credit'] = sum(
                    [pay.bill.total for pay in pay_details.filter(date__range=(date_from, date_to))]) - sum(
                    [pay.total for pay in pay_details.filter(date__range=(date_from, date_to))])

                dealer_data.append(details)
            data['category_details'] = dealer_data

            file_genearte = GenerateDailyReportExcell(data)

            return file_genearte.generate()
        except Exception as e:
            print(e)
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
