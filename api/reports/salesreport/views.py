from targets.models import SalesrefValueTarget
from targets.models import SalesrefTargets
from dealer_details.models import Dealer
from reportclasses.productive_report import ProductiveReportExcell
from not_buy_details.models import NotBuyDetails
from reportclasses.itenery_report import IteneryReportExcell
from item_category.models import Category
from datetime import date, timedelta, datetime
from primary_sales_area.models import PrimarySalesArea
from rest_framework import status
from rest_framework.response import Response
from distrubutor_salesref_invoice.models import SalesRefInvoice, PaymentDetails, ChequeDetails, InvoiceIntem, Item
from distrubutor_salesref.models import SalesRefDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404

from userdetails.models import UserDetails


class FilterByDate(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        bill_status = request.data['status']
        sales_ref = request.data['sales_ref']

        filters = {}

        if bill_status != 'all':
            filters = {
                'status': bill_status
            }

        if sales_ref != '':
            filters['dis_sales_ref__sales_ref'] = sales_ref

        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor.id

            filters['added_by'] = UserDetails.objects.get(
                user=request.user.id).id

        else:
            distributor = request.data['distributor']

        filters['dis_sales_ref__distributor'] = distributor
        if by_date:
            filters['date__range'] = (date_from, date_to)
        invoices = SalesRefInvoice.objects.filter(**filters)
        serializer = serializers.InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FilterByCategory(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        category = int(request.data['category'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        bill_status = request.data['status']
        sales_ref = request.data['sales_ref']
        filters = {}
        if bill_status != 'all':
            filters = {
                'invoice_item__bill__status': bill_status
            }

        if sales_ref != '':
            filters['invoice_item__bill__dis_sales_ref__sales_ref'] = sales_ref

        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor.id
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=distributor, added_by__user=request.user.id)

        else:
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=request.data['distributor'])
        filters['invoice_item__bill__in'] = invoices
        if category != -1:
            filters['item__item__category'] = category
        if by_date:
            filters['invoice_item__bill__date__range'] = (date_from, date_to)

        items = Item.objects.filter(**filters)
        serializer = serializers.InvoiceItemSerializer(items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
#


class FilterByProduct(APIView):
    def post(self, request, *args, **kwargs):
        item = self.kwargs.get('id')
        product = int(request.data['product'])
        date_from = request.data['date_from']
        date_to = request.data['date_to']
        by_date = bool(date_from and date_to)
        bill_status = request.data['status']
        sales_ref = request.data['sales_ref']
        filters = {}
        if bill_status != 'all':
            filters = {
                'invoice_item__bill__status': bill_status
            }
        if sales_ref != '':
            filters['invoice_item__bill__dis_sales_ref__sales_ref'] = sales_ref
        if request.user.is_salesref:
            distributor = SalesRefDistributor.objects.get(
                sales_ref__user=request.user.id).distributor.id
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=distributor, added_by__user=request.user.id)

        else:
            invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=request.data['distributor'])
        filters['invoice_item__bill__in'] = invoices

        if product != -1:
            filters['item'] = product
        if by_date:
            filters['invoice_item__bill__date__range'] = (date_from, date_to)
        items = Item.objects.filter(**filters)
        serializer = serializers.InvoiceItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IteneryReport(APIView):
    def post(self, request):

        try:
            today = date.today()
            now = datetime.now()
            current_month_name = now.strftime('%B')
            three_months_ago = today - timedelta(days=30 * 3)
            psa = request.data['psa']
            sales_ref = request.data['sales_ref']
            distributor = request.data['distributor']
            categories = Category.objects.all()
            data = {
                'main_details': {
                    'month': current_month_name,
                    'sales_rep': UserDetails.objects.get(id=sales_ref).full_name,
                    'area': PrimarySalesArea.objects.get(id=psa).area_name,
                    'distributor': UserDetails.objects.get(id=distributor).full_name,

                }
            }
            dealers = Dealer.objects.filter(psa=psa)
            psas = PrimarySalesArea.objects.filter(sales_ref=sales_ref)
            psa_data = []

            for dealer in dealers:

                try:
                    visited = SalesRefInvoice.objects.filter(
                        dis_sales_ref__sales_ref=sales_ref, dealer=dealer).last().date
                except:
                    visited = 'No'
                row_data = {}
                row_data['psa'] = dealer.name
                row_data['visited'] = visited

                sales_list = []
                for category in categories:
                    sales_data = {}
                    bill_items = Item.objects.filter(item__item__category=category, invoice_item__bill__date__range=(three_months_ago, today), invoice_item__bill__dealer=dealer
                                                     )

# invoice_item__bill__dis_sales_ref__sales_ref=sales_ref,
                    sale_sum = sum(
                        [bil_item.foc+bil_item.qty for bil_item in bill_items])
                    sales_data[category.short_code] = sale_sum if sale_sum > 0 else ' '
                    sales_list.append(sales_data)
                row_data['sales'] = sales_list
                psa_data.append(row_data)

                invoices = SalesRefInvoice.objects.filter(
                    dis_sales_ref__sales_ref=sales_ref, date__range=(three_months_ago, today), dealer=dealer)

                row_data['cash'] = sum([i.total_cash() for i in invoices])
                row_data['cheque'] = sum([i.total_cheques() for i in invoices])
                row_data['credit'] = sum([i.total_credit() for i in invoices])

                try:
                    not_settle_date = SalesRefInvoice.objects.filter(
                        dis_sales_ref__sales_ref=sales_ref, is_settiled=False, dealer=dealer, status='confirmed').first().date
                except:
                    not_settle_date = ' '
                row_data['not_settled_date'] = not_settle_date

            data['category_details'] = psa_data
            file_genearte = IteneryReportExcell(data)

            return file_genearte.generate()

        except Exception as e:
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProductivityReport(APIView):
    def post(self, request):

        try:
            today = date.today()
            now = datetime.now()

            current_month_name = now.strftime('%B')

            first_day_of_current_month = today.replace(day=1)
            last_day_of_last_month = first_day_of_current_month - \
                timedelta(days=1)

            # Get the date for the last month
            last_month_date = last_day_of_last_month.replace(day=1)
            sales_ref = request.data['sales_ref']
            distributor = request.data['distributor']
            row_data = {}
            row_data['main_details'] = {
                'as_at': UserDetails.objects.get(user=request.user).full_name,
                'sales_ref': UserDetails.objects.get(id=sales_ref).full_name,
                'month': current_month_name,
                'date': today,
            }
            ## actual working ##
            created_invoices_this_month = SalesRefInvoice.objects.filter(
                added_by=sales_ref, date__month=today.month, status='confirmed')
            created_not_buy_this_month = NotBuyDetails.objects.filter(
                added_by=UserDetails.objects.get(id=sales_ref).user, datetime__month=today.month)

            all_days_this_month = [inv.date.strftime("%Y-%m-%d")
                                   for inv in created_invoices_this_month]
            all_days_this_month.extend([nb.datetime.date().strftime("%Y-%m-%d")
                                        for nb in created_not_buy_this_month])
            unique_dates_this_month = list(set(all_days_this_month))

            total_unique_days_this_month = len(unique_dates_this_month)
            ########

            ## target working ##

            ##

            ## last month actual##
            created_invoices_last_month = SalesRefInvoice.objects.filter(
                added_by=sales_ref, date__month=last_month_date.month, status='confirmed')
            created_not_buy_last_month = NotBuyDetails.objects.filter(
                added_by=UserDetails.objects.get(id=sales_ref).user, datetime__month=last_month_date.month)

            all_days_last_month = [inv.date.strftime("%Y-%m-%d")
                                   for inv in created_invoices_last_month]
            all_days_last_month.extend([nb.datetime.date().strftime("%Y-%m-%d")
                                        for nb in created_not_buy_last_month])
            unique_dates_last_month = list(set(all_days_last_month))

            total_unique_days_last_month = len(unique_dates_last_month)

            #######

            ### Cumulative##

            created_invoices_cumulative = SalesRefInvoice.objects.filter(
                added_by=sales_ref, status='confirmed')
            created_not_buy_cumulative = NotBuyDetails.objects.filter(
                added_by=UserDetails.objects.get(id=sales_ref).user)

            all_days_cumulative = [inv.date.strftime("%Y-%m-%d")
                                   for inv in created_invoices_cumulative]
            all_days_cumulative.extend([nb.datetime.date().strftime("%Y-%m-%d")
                                        for nb in created_not_buy_cumulative])
            unique_dates_cumulative = list(set(all_days_cumulative))

            total_unique_days_cumulative = len(unique_dates_cumulative)

            ####

            row_data['days_worked'] = {
                'month': {
                    'this_target': '',
                    'this_actual': total_unique_days_this_month,
                    'last_actual': total_unique_days_last_month
                },
                'cumulative': {
                    'this_actual': total_unique_days_cumulative,

                }
            }

            # cash sales this month
            invoices_this = created_invoices_this_month
            total_this_cash = 0
            total_this_credit = 0
            total_this_cheque = 0
            for inv in invoices_this:
                total_this_cash += inv.total_cash()
                total_this_credit += inv.total_credit()
                total_this_cheque += inv.total_cheques()

            # cash sales last month
            invoices_last = created_invoices_last_month

            total_last_cash = 0
            total_last_credit = 0
            total_last_cheque = 0
            for inv in invoices_last:
                total_last_cash += inv.total_cash()
                total_last_credit += inv.total_credit()
                total_last_cheque += inv.total_cheques()

            # cash sales cumulative
            invoices_all = created_invoices_cumulative

            total_cumulative_cash = 0
            total_cumulative_credit = 0
            total_cumulative_cheque = 0
            for inv in invoices_all:
                total_cumulative_cash += inv.total_cash()
                total_cumulative_credit += inv.total_credit()
                total_cumulative_cheque += inv.total_cheques()

            ######

            row_data['turnover_cash'] = {
                'month': {
                    'this_target': '',
                    'this_actual': total_this_cash,
                    'last_actual': total_last_cash
                },
                'cumulative': {
                    'this_actual': total_cumulative_cash,

                }
            }

            row_data['turnover_credit'] = {
                'month': {
                    'this_target': '',
                    'this_actual': total_this_credit,
                    'last_actual': total_last_credit
                },
                'cumulative': {
                    'this_actual': total_cumulative_credit,

                }
            }

            row_data['turnover_cheque'] = {
                'month': {
                    'this_target': '',
                    'this_actual': total_this_cheque,
                    'last_actual': total_last_cheque
                },
                'cumulative': {
                    'this_actual': total_cumulative_cheque,

                }
            }

            target_value = SalesrefValueTarget.objects.get(
                target_person=sales_ref, date_form__month=today.month, date_to__month=today.month)
            row_data['turnover_total'] = {
                'month': {
                    'this_target': target_value.value,
                    'this_actual': sum([row_data['turnover_cash']['month']['this_actual'], row_data['turnover_credit']['month']['this_actual'], row_data['turnover_cheque']['month']['this_actual']]),
                    'last_actual': sum([row_data['turnover_cash']['month']['last_actual'], row_data['turnover_credit']['month']['last_actual'], row_data['turnover_cheque']['month']['last_actual']]),
                },
                'cumulative': {
                    'this_actual': sum([row_data['turnover_cash']['cumulative']['this_actual'], row_data['turnover_credit']['cumulative']['this_actual'], row_data['turnover_cheque']['cumulative']['this_actual']]),

                }
            }

            # total invoices
            row_data['callage_tot_calls'] = {
                'month': {
                    'this_target': '',
                    'this_actual': created_invoices_this_month.count(),
                    'last_actual': created_invoices_last_month.count()
                },
                'cumulative': {
                    'this_actual': created_invoices_cumulative.count(),

                }
            }

            # total productive calls
            row_data['callage_tot_productive_calls'] = {
                'month': {
                    'this_target': '',
                    'this_actual':  InvoiceIntem.objects.filter(bill__in=created_invoices_this_month).count(),
                    'last_actual': InvoiceIntem.objects.filter(bill__in=created_invoices_last_month).count()
                },
                'cumulative': {
                    'this_actual': InvoiceIntem.objects.filter(bill__in=created_invoices_cumulative).count(),

                }
            }

            categories = Category.objects.all()
            row_data['product_categories'] = [
                i.short_code for i in categories]
            category_details = []

            for category in categories:
                # details = {}
                targets = SalesrefTargets.objects.filter(
                    target_person=sales_ref, date_form__month=today.month, date_to__month=today.month, category=category)
                details = {
                    'month': {
                        'this_target': sum([i.qty+i.foc for i in targets]),
                        'this_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_this_month, item__item__category=category)]),
                        'last_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_last_month, item__item__category=category)])
                    },
                    'cumulative': {
                        'this_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_cumulative, item__item__category=category)]),

                    }
                }
                category_details.append(details)

            row_data['product_categories_collage'] = category_details

            category_avg_details = []

            for category in categories:

                val_details = {
                    'month': {
                        'this_target': ' ',
                        'this_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_this_month, item__item__category=category)]) / row_data['callage_tot_productive_calls']['month']['this_actual'] if row_data['callage_tot_productive_calls']['month']['this_actual'] != 0 else 1,
                        'last_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_last_month, item__item__category=category)])/row_data['callage_tot_productive_calls']['month']['last_actual'] if row_data['callage_tot_productive_calls']['month']['last_actual'] != 0 else 1
                    },
                    'cumulative': {
                        'this_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_cumulative, item__item__category=category)])/row_data['callage_tot_productive_calls']['cumulative']['this_actual'] if row_data['callage_tot_productive_calls']['cumulative']['this_actual'] != 0 else 1,

                    }
                }
                category_avg_details.append(val_details)

            row_data['product_categories_average'] = category_avg_details

            file_genearte = ProductiveReportExcell(row_data)

            return file_genearte.generate()
            # return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
