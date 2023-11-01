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


class GetDailyReport(APIView):
    def post(self, request):
        print(request.data)
        date_from = request.data['date']
        sales_ref = request.data['sales_ref']

        filters = {}
        filters['dis_sales_ref__sales_ref'] = sales_ref
        invoices = SalesRefInvoice.objects.filter(**filters)
        maket_returns = SalesRefReturn.objects.filter(**filters)
        none_buy_recodes = NotBuyDetails.objects.filter(**filters)
        print(invoices)
        print(maket_returns)
        print(none_buy_recodes)

        main_details = []
        sales = []
        foc = []
        payment_details = []

        for invoice in invoices:
            main_details.append({
                'dealer': invoice.dealer.name,
                'psa': invoice.dealer.psa.area_name,
                'visited_time': invoice.time
            })

            sales.append({
                'dealer': invoice.dealer.name,
                'items': invoice.get_bill_items_with_categories(),
            })
            # print()
            # for item in items:
            #     sales.append({
            #         'dealer': item.bill.dealer.name,
            #         'category': item.item_category(),
            #         'total': item.extended_price
            #     })
            #     foc.append({
            #         'category': item.item_category(),
            #         'qty': item.foc
            #     })

            payments = PaymentDetails.objects.filter(bill=invoice)

            for payment in payments:

                payment_details.append({
                    'cash': payment.get_cash(),
                    'cheque': payment.get_cheque(),
                    'credit': payment.get_credit(),
                })

        market_return = []

        for market_ret in maket_returns:
            mret_items = SalesRefReturnItem.objects.filter(
                salesrefreturn=market_ret)
            for mret_item in mret_items:
                market_return.append({
                    'category': mret_item.item_category(),
                    'total': mret_item.qty+mret_item.foc
                })

        not_buy_details = []

        for none_buy_recode in none_buy_recodes:

            not_buy_details.append({
                'dealer': none_buy_recode.dealer.name,
                'reason': none_buy_recode.get_reson()
            })

        data = {
            'main_details': main_details,
            'sales': sales,
            'foc': foc,
            'market_return': market_return,
            'payment_details': payment_details,
            'not_buy_details': not_buy_details,
        }

        print(data)

        return Response(data=data, status=status.HTTP_200_OK)
