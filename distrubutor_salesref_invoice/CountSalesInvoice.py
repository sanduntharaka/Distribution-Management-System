from distrubutor_salesref_invoice.models import SalesRefInvoice
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from userdetails.models import UserDetails
from datetime import datetime, timedelta
from django.db.models import Sum
import random
from executive_distributor.models import ExecutiveDistributor


class CountSalesInvoiceAll:
    def __init__(self, date, user_details, user_type) -> None:
        self.user_details = user_details
        self.user_type = user_type
        self.date_obj = datetime.strptime(date, '%Y-%m-%d')
        self.month = self.date_obj.month
        self.year = self.date_obj.year
        self.date = date

        previous_date = self.date_obj - timedelta(days=1)
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
            salesre_distributors = SalesRefDistributor.objects.filter(
                sales_ref=user_details).values('distributor')
            self.salesre_distributors_ids = [salesre_distributor['distributor']
                                             for salesre_distributor in salesre_distributors]
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

        if user_type == 'company':
            manager_distributors = ManagerDistributor.objects.all().values('distributor')
            self.distributor_ids = [distributor['distributor']
                                    for distributor in manager_distributors]
            self.invoices = SalesRefInvoice.objects.filter(
                date=date, dis_sales_ref__distributor__in=self.distributor_ids).all()
            self.previnvoices = SalesRefInvoice.objects.filter(
                date=previous_date_str, dis_sales_ref__distributor__in=self.distributor_ids).all()

        if user_type == 'executive':

            executive_distributors = ExecutiveDistributor.objects.filter(
                executive=user_details).values('distributor')
            self.distributor_ids = [distributor['distributor']
                                    for distributor in executive_distributors]
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

    def getYesterDay(self):
        invoice_count = 0
        total_sales = 0
        total_balance = 0

        yesterday = self.date_obj - timedelta(days=1)
        print(yesterday)
        if self.user_type == 'company':
            invoices = SalesRefInvoice.objects.filter(
                status='pending', dis_sales_ref__distributor__in=self.distributor_ids, date=yesterday).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

        if self.user_type == 'manager':

            invoices = SalesRefInvoice.objects.filter(
                status='pending', dis_sales_ref__distributor__in=self.distributor_ids, date=yesterday).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

        if self.user_type == 'executive':
            invoices = SalesRefInvoice.objects.filter(
                status='pending', dis_sales_ref__distributor__in=self.distributor_ids, date=yesterday).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

        if self.user_type == 'distributor':

            invoices = SalesRefInvoice.objects.filter(
                status='pending', dis_sales_ref__distributor__in=self.salesre_distributors_ids, date=yesterday).all()

            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

            # total_balance = total_sales - \
            #     sum([invoice.get_payed() for invoice in invoices])

        if self.user_type == 'salesref':
            invoices = SalesRefInvoice.objects.filter(
                status='pending', dis_sales_ref__sales_ref=self.user_details, date=yesterday, added_by=self.user_details).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0
            # if total_sales == None:
            #     total_balance = 0
            # else:
            #     total_balance = total_sales - \
            #         sum([invoice.get_payed() for invoice in invoices])

        return invoice_count, total_sales

    def getThisMonth(self):
        invoice_count = 0
        total_sales = 0
        total_balance = 0
        if self.user_type == 'company':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.distributor_ids, date__month=self.month).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

        if self.user_type == 'manager':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.distributor_ids, date__month=self.month).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

            total_balance = total_sales - \
                sum([invoice.get_payed() for invoice in invoices])

        if self.user_type == 'executive':
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
        if self.user_type == 'company':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.distributor_ids, date__year=self.year).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

        if self.user_type == 'manager':
            invoices = SalesRefInvoice.objects.filter(
                status='confirmed', dis_sales_ref__distributor__in=self.distributor_ids, date__year=self.year).all()
            invoice_count = invoices.count()
            total_sales = invoices.aggregate(total=Sum('total'))['total'] if invoices.aggregate(
                total=Sum('total'))['total'] is not None else 0

            total_balance = total_sales - \
                sum([invoice.get_payed() for invoice in invoices])

        if self.user_type == 'executive':
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
                dis_sales_ref__distributor=distributor, status='confirmed', date__month=self.month)
            details['name'] = filtered_invoices.first(
            ).dis_sales_ref.distributor.full_name
            details['value'] = sum([i.total for i in filtered_invoices])
            data.append(details)
        color_codes = self.generate_color_codes(len(distributors))
        return data, color_codes

    def getAllManagersSales(self):
        data = []

        managers = list(
            ManagerDistributor.objects.values_list('manager', flat=True))

        for mnger in managers:
            details = {}
            manager = UserDetails.objects.get(id=mnger)
            disstributors = ManagerDistributor.objects.filter(
                manager=mnger).values_list('distributor', flat=True)

            filtered_invoices = SalesRefInvoice.objects.filter(
                dis_sales_ref__distributor__in=disstributors, status='confirmed', date__month=self.month)

            details['name'] = manager.full_name
            details['value'] = sum([i.total for i in filtered_invoices])
            data.append(details)
        color_codes = self.generate_color_codes(len(managers))
        return data, color_codes

    def getPendingInvoices(self):
        seven_days_ago = self.date_obj - timedelta(days=7)
        pending = SalesRefInvoice.objects.filter(
            status='pending', dis_sales_ref__distributor__in=self.salesre_distributors_ids).all()
        total = pending.aggregate(total_sum=Sum('total'))['total_sum']
        count = pending.count()
        obove_seven_days = pending.filter(
            date__lte=seven_days_ago).count()
        return total, count, obove_seven_days

    def getCreditInvoices(self):
        days_ago = self.date_obj - timedelta(days=45)
        pending = SalesRefInvoice.objects.filter(
            status='confirmed', is_settiled=False, dis_sales_ref__distributor__in=self.salesre_distributors_ids).all()
        total = sum(invoice.get_balance() for invoice in pending)

        count = pending.count()

        obove_seven_days = pending.filter(
            date__lte=days_ago).count()

        return total, count, obove_seven_days
