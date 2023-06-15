from distrubutor_salesref_invoice.models import SalesRefInvoice
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from datetime import datetime, timedelta
from django.db.models import Sum
import random


class CountSalesInvoiceAll:
    def __init__(self, date, user_details, user_type) -> None:
        self.user_details = user_details
        self.user_type = user_type
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        self.month = date_obj.month
        self.year = date_obj.year

        previous_date = date_obj - timedelta(days=1)
        previous_date_str = previous_date.strftime('%Y-%m-%d')
        if user_type == 'distributor':
            salesre_distributors = SalesRefDistributor.objects.filter(
                distributor=user_details).values('distributor')
            self.salesre_distributors_ids = [salesre_distributor['distributor']
                                             for salesre_distributor in salesre_distributors]
            self.invoices = SalesRefInvoice.objects.filter(
                date=date, dis_sales_ref__distributor__in=self.salesre_distributors_ids).all()
            self.previnvoices = SalesRefInvoice.objects.filter(
                date=previous_date_str, dis_sales_ref__distributor__in=self.salesre_distributors_ids).all()

        if user_type == 'salesref':
            self.invoices = SalesRefInvoice.objects.filter(
                date=date, dis_sales_ref__sales_ref=user_details, added_by=user_details).all()
            self.previnvoices = SalesRefInvoice.objects.filter(
                date=previous_date_str, dis_sales_ref__sales_ref=user_details, added_by=user_details).all()

        if user_type == 'manager':

            manager_distributors = ManagerDistributor.objects.filter(
                manager=user_details).values('distributor')
            self.distributor_ids = [distributor['distributor']
                                    for distributor in manager_distributors]
            self.invoices = SalesRefInvoice.objects.filter(
                date=date, dis_sales_ref__distributor__in=self.distributor_ids).all()
            self.previnvoices = SalesRefInvoice.objects.filter(
                date=previous_date_str, dis_sales_ref__distributor__in=self.distributor_ids).all()

    def getCount(self):
        return self.invoices.count()

    def totalSale(self):
        return sum([i.total for i in self.invoices])

    def totalDiscont(self):
        return sum([i.total_discount for i in self.invoices])

    def getPrevDayStatus(self):
        current = sum([i.total for i in self.invoices])
        prev = sum([i.total for i in self.previnvoices])

        return current > prev

    def getallpending(self):
        return SalesRefInvoice.objects.filter(
            status='pending', dis_sales_ref__distributor__in=self.salesre_distributors_ids).all().count()

    def getThisMonth(self):
        invoice_count = 0
        total_sales = 0
        total_balance = 0
        if self.user_type == 'manager':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.distributor_ids, date__month=self.month).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

            total_balance = total_sales - \
                sum([invoice.get_payed() for invoice in invoices])

        if self.user_type == 'distributor':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.salesre_distributors_ids, date__month=self.month).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

            total_balance = total_sales - \
                sum([invoice.get_payed() for invoice in invoices])

        if self.user_type == 'salesref':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__sales_ref=self.user_details, date__month=self.month, added_by=self.user_details).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0
            if total_sales == None:
                total_balance = 0
            else:
                total_balance = total_sales - \
                    sum([invoice.get_payed() for invoice in invoices])

        return invoice_count, total_sales, total_balance

    def getThisYear(self):
        invoice_count = 0
        total_sales = 0
        total_balance = 0
        if self.user_type == 'manager':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.distributor_ids, date__year=self.year).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

            total_balance = total_sales - \
                sum([invoice.get_payed() for invoice in invoices])
        if self.user_type == 'distributor':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.salesre_distributors_ids, date__year=self.year).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0
            total_balance = total_sales - \
                sum([invoice.get_payed() for invoice in invoices])

        if self.user_type == 'salesref':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__sales_ref=self.user_details, date__year=self.year, added_by=self.user_details).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0
            if total_sales == None:
                total_balance = 0
            else:
                total_balance = total_sales - \
                    sum([invoice.get_payed() for invoice in invoices])

        return invoice_count, total_sales, total_balance

    def generate_color_codes(self, num_codes):
        color_codes = []

        for _ in range(num_codes):
            r = random.randint(0, 255)
            g = random.randint(0, 255)
            b = random.randint(0, 255)

            color_code = "#{:02x}{:02x}{:02x}".format(r, g, b)
            color_codes.append(color_code)

        return color_codes

    def getAllDistributorsSales(self):
        data = []

        distributors = self.distributor_ids
        # invoices = SalesRefInvoice.objects.filter(dis_sales_ref__distributor__in=distributors,date__month=self.month)

        for distributor in distributors:
            details = {}
            filtered_invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor=distributor, date__month=self.month)
            details['name'] = filtered_invoices.first(
            ).dis_sales_ref.distributor.full_name
            details['value'] = sum([i.total for i in filtered_invoices])
            data.append(details)
        color_codes = self.generate_color_codes(len(distributors))
        return data, color_codes
