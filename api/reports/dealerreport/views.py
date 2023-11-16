from reportclasses.retailer_performance import RetailerPerformanceReportExcell
from django.core.exceptions import ObjectDoesNotExist
from datetime import date, timedelta, datetime
from item_category.models import Category
from distrubutor_salesref_invoice.models import PaymentDetails, SalesRefInvoice, ChequeDetails, Item, InvoiceIntem
from data_classes.UsersUderCompany import UsersUnderCompany
from data_classes.UsersUnderExecutive import UsersUnderExecutive
from rest_framework import status
from rest_framework.response import Response
from userdetails.models import UserDetails
from dealer_details.models import Dealer
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from . import serializers
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from data_classes.UsersUnderDestributor import UsersUnderDestributor
from data_classes.UsersUnderManager import UsersUnderManager
from data_classes.UsersUnderExecutive import UsersUnderExecutive


class AllDealerDetails(generics.ListAPIView):
    queryset = Dealer.objects.all()
    serializer_class = serializers.DealerDetailsSerializer


class AllDealerDetailsBy(APIView):
    def get(self, *args, **kwargs):
        try:
            user_details_id = self.kwargs.get('id')
            user = self.request.user.id
            if self.request.user.is_company:
                user_details = UsersUnderCompany(user_details_id)
                users = user_details.get_users_under_to_me_ids()

            if self.request.user.is_manager:
                user_details = UsersUnderManager(user_details_id)
                users = user_details.get_users_under_to_me_with_me_ids()

            if self.request.user.is_excecutive:
                user_details = UsersUnderExecutive(user_details_id)
                users = user_details.get_users_in_my_cluster_ids()

            if self.request.user.is_distributor:
                user_details = UsersUnderDestributor(user_details_id)
                users = user_details.get_users_under_to_me_with_me_ids()

            if self.request.user.is_salesref:
                users = [user_details_id]
            user_ids = UserDetails.objects.filter(
                id__in=users).values_list('user', flat=True)
            dealers = Dealer.objects.filter(
                added_by__in=user_ids)
            serializer = serializers.DealerDetailsSerializer(
                dealers, many=True)
            #
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllDealerDetailsByManager(APIView):
    def get(self, *args, **kwargs):
        item = self.kwargs.get('id')

        distributors = ManagerDistributor.objects.filter(
            manager=item).values('distributor')
        distributors_id = [distributor['distributor']
                           for distributor in distributors]
        salesrefs = SalesRefDistributor.objects.filter(
            distributor__in=distributors_id).values('sales_ref')
        distributors = SalesRefDistributor.objects.filter(
            distributor__in=distributors_id).values('distributor')
        salesrefs_ids = [salesref['sales_ref']
                         for salesref in salesrefs]
        [salesrefs_ids.append(distributor['distributor'])
         for distributor in distributors]
        salesref_list = UserDetails.objects.filter(
            id__in=salesrefs_ids).values('user')
        salesref_users_id = [sf['user']
                             for sf in salesref_list]

        dealers = Dealer.objects.filter(added_by__in=salesref_users_id)
        serializer = serializers.DealerDetailsSerializer(dealers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RetailerPerformanceReport(APIView):
    def post(self, request):
        try:
            today = date.today()
            now = datetime.now()
            first_day_of_current_month = today.replace(day=1)
            last_day_of_last_month = first_day_of_current_month - \
                timedelta(days=1)

            # Get the date for the last month
            last_month_date = last_day_of_last_month.replace(day=1)

            dealer = Dealer.objects.get(id=request.data['dealer'])

            main_details = {
                'name': dealer.name,
                'address': dealer.address,
                'contact': dealer.company_number,
                'type': dealer.category.category_name,
                'grade': dealer.grade,
                'pay_mode': f"{'cash/' if PaymentDetails.objects.filter(bill__dealer=dealer,payment_type__in=['cash','cash-credit','cash-cheque','cash-credit-cheque']).count() > 0 else ' '} {'cheque/' if PaymentDetails.objects.filter(bill__dealer=dealer,payment_type__in=['cheque','cheque-credit','cash-cheque','cash-credit-cheque']).count() > 0 else ' '} {'credit/' if PaymentDetails.objects.filter(bill__dealer=dealer,payment_type__in=['credit','cash-credit','cheque-credit','cash-credit-cheque']).count() > 0 else ' '}",
                'last_pay_date': PaymentDetails.objects.filter(
                    bill__dealer=dealer, bill__status='confirmed').last().date,
                'outstanding': PaymentDetails.objects.filter(bill__dealer=dealer, bill__status='confirmed').first().get_credit(),
                'outstanding_when': SalesRefInvoice.objects.filter(dealer=dealer, status='confirmed').last().date,
                'return_cheques': ChequeDetails.objects.filter(payment_details__bill__dealer=dealer).count(),
            }

            item_categories = Category.objects.all()
            data = []
            for itm in item_categories:
                details = {}
                details['category'] = itm.category_name
                details['this_month'] = sum([i.qty + i.foc for i in Item.objects.filter(
                    item__item__category=itm, invoice_item__bill__date__month=today.month, invoice_item__bill__status='confirmed')])
                details['last_month'] = sum([i.qty + i.foc for i in Item.objects.filter(
                    item__item__category=itm, invoice_item__bill__date__month=last_day_of_last_month.month, invoice_item__bill__status='confirmed')])
                details['previous'] = sum([i.qty + i.foc for i in Item.objects.filter(
                    item__item__category=itm, invoice_item__bill__date__month__lt=last_day_of_last_month.month, invoice_item__bill__status='confirmed')])
                #

                try:
                    latest_item = Item.objects.filter(
                        item__item__category=itm, invoice_item__bill__status='confirmed'
                    ).last()

                    if latest_item is None:
                        raise ObjectDoesNotExist("Item does not exist")
                    else:
                        details['last_p_date'] = latest_item.invoice_item.bill.date
                except ObjectDoesNotExist:
                    details['last_p_date'] = ' '

                data.append(details)
            file_genearte = RetailerPerformanceReportExcell(
                {'main_details': main_details, 'category_details': data})

            return file_genearte.generate()
            # return Response(status=status.HTTP_200_OK)
# Any Return Cheques
            # return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
