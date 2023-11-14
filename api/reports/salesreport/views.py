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
            sales_ref = request.data['sales_ref']
            distributor = request.data['distributor']
            categories = Category.objects.all()
            data = {
                'main_details': {
                    'month': current_month_name,
                    'sales_rep': UserDetails.objects.get(id=sales_ref).full_name,
                    'area': UserDetails.objects.get(id=sales_ref).getTerrotories(),
                    'distributor': UserDetails.objects.get(id=distributor).full_name,

                }
            }

            psas = PrimarySalesArea.objects.filter(sales_ref=sales_ref)
            psa_data = []

            for psa in psas:
                row_data = {}
                row_data['psa'] = psa.area_name
                row_data['visited'] = 'ss'

                sales_list = []
                for category in categories:
                    sales_data = {}
                    bill_items = Item.objects.filter(item__item__category=category, invoice_item__bill__date__range=(three_months_ago, today), invoice_item__bill__dealer__psa=psa
                                                     )

# invoice_item__bill__dis_sales_ref__sales_ref=sales_ref,
                    sale_sum = sum(
                        [bil_item.foc+bil_item.qty for bil_item in bill_items])
                    sales_data[category.category_name] = sale_sum if sale_sum > 0 else ' '
                    sales_list.append(sales_data)
                row_data['sales'] = sales_list
                psa_data.append(row_data)

                pay_details = PaymentDetails.objects.filter(
                    bill__dis_sales_ref__sales_ref=sales_ref, bill__date__range=(three_months_ago, today), bill__dealer__psa=psa)
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

                row_data['cash'] = sum(cash)
                row_data['cheque'] = sum(cheque)
                row_data['credit'] = sum(credit)

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
                    'this_actual': total_unique_days_this_month,
                    'last_actual': total_unique_days_last_month
                },
                'cumulative': {
                    'this_actual': total_unique_days_cumulative,

                }
            }

            # cash sales this month
            pay_details_cash = PaymentDetails.objects.filter(bill__in=created_invoices_this_month, payment_type__in=[
                                                             'cash', 'cash-credit', 'cash-cheque', 'cash-credit-cheque'])
            total_this_cash = 0
            for pd_cash in pay_details_cash:
                if pd_cash.payment_type == 'cash' or pd_cash.payment_type == 'cash-credit':
                    total_this_cash += pd_cash.paid_amount
                if pd_cash.payment_type == 'cash-cheque' or pd_cash.payment_type == 'cash-credit-cheque':
                    total_this_cash += pd_cash.paid_amount - pd_cash.get_cheque_amount()

            # cash sales last month
            pay_details_cash = PaymentDetails.objects.filter(bill__in=created_invoices_last_month, payment_type__in=[
                                                             'cash', 'cash-credit', 'cash-cheque', 'cash-credit-cheque'])
            total_last_cash = 0
            for pd_cash in pay_details_cash:
                if pd_cash.payment_type == 'cash' or pd_cash.payment_type == 'cash-credit':
                    total_last_cash += pd_cash.paid_amount
                if pd_cash.payment_type == 'cash-cheque' or pd_cash.payment_type == 'cash-credit-cheque':
                    total_last_cash += pd_cash.paid_amount - pd_cash.get_cheque_amount()

            # cash sales cumulative
            pay_details_cash = PaymentDetails.objects.filter(bill__in=created_invoices_cumulative, payment_type__in=[
                                                             'cash', 'cash-credit', 'cash-cheque', 'cash-credit-cheque'])
            total_cumulative_cash = 0
            for pd_cash in pay_details_cash:
                if pd_cash.payment_type == 'cash' or pd_cash.payment_type == 'cash-credit':
                    total_cumulative_cash += pd_cash.paid_amount
                if pd_cash.payment_type == 'cash-cheque' or pd_cash.payment_type == 'cash-credit-cheque':
                    total_cumulative_cash += pd_cash.paid_amount - pd_cash.get_cheque_amount()

            ######

            row_data['turnover_cash'] = {
                'month': {
                    'this_actual': total_this_cash,
                    'last_actual': total_last_cash
                },
                'cumulative': {
                    'this_actual': total_cumulative_cash,

                }
            }

            # credit sales this month
            pay_details_credit = PaymentDetails.objects.filter(bill__in=created_invoices_this_month, payment_type__in=[
                                                               'credit', 'cash-credit', 'cheque-credit', 'cash-credit-cheque'])
            total_this_credit = 0
            for pd_credit in pay_details_credit:

                total_this_credit += pd_credit.get_credit()

            # credit sales last month
            pay_details_credit = PaymentDetails.objects.filter(bill__in=created_invoices_last_month, payment_type__in=[
                                                               'credit', 'cash-credit', 'cheque-credit', 'cash-credit-cheque'])
            total_last_credit = 0
            for pd_credit in pay_details_credit:

                total_last_credit += pd_credit.get_credit()

            # credit sales cumulative
            pay_details_credit = PaymentDetails.objects.filter(bill__in=created_invoices_cumulative, payment_type__in=[
                                                               'credit', 'cash-credit', 'cheque-credit', 'cash-credit-cheque'])
            total_cumulative_credit = 0
            for pd_credit in pay_details_credit:

                total_cumulative_credit += pd_credit.get_credit()

            ######

            row_data['turnover_credit'] = {
                'month': {
                    'this_actual': total_this_cash,
                    'last_actual': total_last_cash
                },
                'cumulative': {
                    'this_actual': total_cumulative_cash,

                }
            }

            # cheque sales this month
            pay_details_cheque = ChequeDetails.objects.filter(
                payment_details__bill__in=created_invoices_this_month)
            total_this_cheque = 0
            for pd_cheque in pay_details_cheque:

                total_this_cheque += pd_cheque.amount

            # cheque sales last month
            pay_details_cheque = ChequeDetails.objects.filter(
                payment_details__bill__in=created_invoices_last_month)
            total_last_cheque = 0
            for pd_cheque in pay_details_cheque:

                total_last_cheque += pd_cheque.amount

            # cash sales cumulative
            pay_details_cheque = ChequeDetails.objects.filter(
                payment_details__bill__in=created_invoices_cumulative)
            total_cumulative_cheque = 0
            for pd_cheque in pay_details_cheque:

                total_cumulative_cheque += pd_cheque.amount

            ######

            row_data['turnover_cheque'] = {
                'month': {
                    'this_actual': total_this_cheque,
                    'last_actual': total_last_cheque
                },
                'cumulative': {
                    'this_actual': total_cumulative_cheque,

                }
            }

            # total invoices
            row_data['callage_tot_calls'] = {
                'month': {
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
                    'this_actual':  InvoiceIntem.objects.filter(bill__in=created_invoices_this_month).count(),
                    'last_actual': InvoiceIntem.objects.filter(bill__in=created_invoices_last_month).count()
                },
                'cumulative': {
                    'this_actual': InvoiceIntem.objects.filter(bill__in=created_invoices_cumulative).count(),

                }
            }

            categories = Category.objects.all()
            row_data['product_categories'] = [
                i.category_name for i in categories]
            category_details = []
            for category in categories:
                details = {}
                details[category.id] = {
                    'month': {
                        'this_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_this_month)]),
                        'last_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_last_month)])
                    },
                    'cumulative': {
                        'this_actual': sum([itm.qty + itm.foc for itm in Item.objects.filter(invoice_item__bill__in=created_invoices_cumulative)]),

                    }
                }
                category_details.append(details)
            row_data['product_categories_collage'] = category_details
            file_genearte = ProductiveReportExcell(row_data)

            return file_genearte.generate()
            # return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
