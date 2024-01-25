from django.db.models import Sum
from targets.models import SalesrepDailyValueTarget
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

from sales_route.models import SalesRoute, DailyStatus

from datetime import date, timedelta


class GetDailyReport(APIView):
    def post(self, request):
        try:

            today = date.today()
            date_from = request.data['date_from']
            date_to = request.data['date_to']

            sales_ref = request.data['sales_ref']
            distributor = request.data['distributor']
            filters = {}
            filters['dis_sales_ref__sales_ref'] = sales_ref
            filters['date__range'] = (date_from, date_to)

            # dealers = Dealer.objects.filter(
            #     id__in=[i['dealer'] for i in dealer_list])
            # print('dd:', dealers)

            categories = Category.objects.all()

            data = {
                'main_details': {
                    'date': date_from,
                    'sales_rep': UserDetails.objects.get(id=sales_ref).full_name,
                    'area': UserDetails.objects.get(id=sales_ref).getTerrotories(),
                    'distributor': UserDetails.objects.get(id=distributor).full_name,
                    'sales_rep_id': sales_ref,
                }
            }
            try:
                planing_route_currunt = DailyStatus.objects.get(
                    date=date_from, route__salesref=sales_ref)
                planned_dealers = planing_route_currunt.current_plan

            except:
                planned_dealers = []
                planing_route_currunt = None
            try:
                planing_route_month = DailyStatus.objects.filter(
                    date__month=today.month, route__salesref=sales_ref)
                visits_list = [i.coverd for i in planing_route_month]
                total_vists = []
                for i in visits_list:
                    for j in i:
                        total_vists.append(j['id'])

            except:
                pass

            data['sub_detail_1'] = {
                'no_calls_p_day': len(planing_route_currunt.coverd) if planing_route_currunt is not None else 0,
                'no_productive_calls_p_day': SalesRefInvoice.objects.filter(**filters, status='confirmed').count(),
                'no_calls_p_month': len(total_vists),
                'no_productive_calls_p_month': SalesRefInvoice.objects.filter(dealer__in=total_vists, date__month=today.month, dis_sales_ref__sales_ref=sales_ref, status='confirmed').count(),

            }

            dealer_data = []
            dealer_list = combined_list = list(
                set(planned_dealers + total_vists))
            dealers = Dealer.objects.filter(id__in=dealer_list)
            for dealer in dealers:
                invoice_list = SalesRefInvoice.objects.filter(
                    **filters, dealer=dealer)

                pay_details = PaymentDetails.objects.filter(
                    bill__in=invoice_list, is_completed=False)

                details = {
                    'dealer': dealer.name,
                    'address': dealer.address,
                    'amount': sum([invoice.total if invoice.is_settiled is not True else 0 for invoice in invoice_list]),
                    'since': pay_details.last().bill.date if pay_details.last() is not None else ' ',
                }

                sales_list = {}
                foc_list = {}
                market_return = {}

                for category in categories:
                    sales_data = {}
                    foc_data = {}
                    market_return_data = {}
                    bill_items = Item.objects.filter(item__item__category=category, invoice_item__bill__dis_sales_ref__sales_ref=sales_ref, invoice_item__bill__date__range=(date_from, date_to), invoice_item__bill__in=invoice_list
                                                     )
                    sale_sum = sum(
                        [bil_item.foc+bil_item.qty for bil_item in bill_items])
                    # sales_data[category.short_code] = sale_sum if sale_sum > 0 else ' '
                    # sales_list.append(sales_data)
                    sales_list[category.short_code] = sale_sum if sale_sum > 0 else ' '

                    foc_sum = sum(
                        [bil_item.foc for bil_item in bill_items])
                    # foc_data[category.short_code] = foc_sum if foc_sum > 0 else ' '
                    # foc_list.append(foc_data)
                    foc_list[category.short_code] = foc_sum if foc_sum > 0 else ' '

                    maket_return_items = SalesRefReturnItem.objects.filter(
                        item__item__category=category, salesrefreturn__dis_sales_ref__sales_ref=sales_ref, salesrefreturn__date__range=(date_from, date_to), salesrefreturn__dealer=dealer)

                    mret_sum = sum(
                        [mk_item.foc+mk_item.qty for mk_item in maket_return_items])
                    market_return[category.short_code] = mret_sum if mret_sum > 0 else ' '

                    # market_return.append(market_return_data)

                details['sales'] = sales_list
                details['foc'] = foc_list
                details['market_return'] = market_return

                details['total'] = sum([i.total for i in invoice_list])
                try:
                    reason = NotBuyDetails.objects.filter(
                        dis_sales_ref__sales_ref=sales_ref, dealer=dealer, datetime__date__range=(date_from, date_to)).first().get_reson()

                except Exception as e:
                    reason = ' '
                details['not_buy_reason'] = reason
                dealer_data.append(details)

            targets = SalesrepDailyValueTarget.objects.filter(
                salesrep__id=sales_ref, date=date_from)

            target_data = []
            for target in targets:
                total = SalesRefInvoice.objects.filter(
                    added_by__id=sales_ref, date=date_from, dealer__psa__id=target.psa.id).aggregate(
                    total_invoices=Sum('total'))['total_invoices']

                target_data.append({
                    'date': target.date,
                    'psa': target.psa.area_name,
                    'value': target.value,
                    'covered': 0 if total is None else total
                })

            data['category_details'] = dealer_data
            data['target_details'] = target_data
            # print(data)
            file_genearte = GenerateDailyReportExcell(data)

            return file_genearte.generate()

            # return Response(data='c', status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
