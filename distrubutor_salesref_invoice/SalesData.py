from .models import SalesRefInvoice
from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from datetime import datetime
from django.db.models.functions import ExtractMonth
import calendar


class SalesData:
    def __init__(self, user, id) -> None:
        self.user = user
        self.id = id
        self.month_order = {
            "January": 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12,
        }
        if self.user == 'manager':
            manager_sales_refs = ManagerDistributor.objects.filter(
                manager=self.id).values('distributor')
            distributor_ids = [dis_mn['distributor']
                               for dis_mn in manager_sales_refs]
            distri_salesrefs = SalesRefDistributor.objects.filter(
                distributor_id__in=distributor_ids).values('id')
            distri_salesref_ids = [dis_sf['id'] for dis_sf in distri_salesrefs]
            self.months = SalesRefInvoice.objects.filter(dis_sales_ref__in=distri_salesref_ids).annotate(
                month=ExtractMonth('date')).values('month').distinct()

        elif self.user == 'distributor':
            self.months = SalesRefInvoice.objects.filter(dis_sales_ref__distributor=self.id).annotate(
                month=ExtractMonth('date')).values('month').distinct()

        elif self.user == 'salesref':
            self.months = SalesRefInvoice.objects.filter(dis_sales_ref__sales_ref=self.id, added_by=self.id).annotate(
                month=ExtractMonth('date')).values('month').distinct()

    def getData(self):
        invoices = []
        filters = {
            'status': 'confirmed'
        }
        if self.user == 'distributor':
            filters['dis_sales_ref__distributor'] = self.id
        elif self.user == 'salesref':
            filters['dis_sales_ref__sales_ref'] = self.id
            filters['added_by'] = self.id
        elif self.user == 'manager':
            manager_distributors = ManagerDistributor.objects.filter(
                manager=self.id).values('distributor')
            distributor_ids = [dis_mn['distributor']
                               for dis_mn in manager_distributors]
            distri_salesrefs = SalesRefDistributor.objects.filter(
                distributor_id__in=distributor_ids).values('id')
            distri_salesref_ids = [dis_sf['id'] for dis_sf in distri_salesrefs]

            filters['dis_sales_ref__in'] = distri_salesref_ids

        for i in self.months:
            filters['date__month'] = i['month']
            invs = SalesRefInvoice.objects.filter(**filters)
            total = sum([i.total - i.total_discount for i in invs])
            data = {
                'month': calendar.month_name[i['month']],
                'total': total
            }
            invoices.append(data)
        return sorted(invoices, key=lambda x: self.month_order[x["month"]])
