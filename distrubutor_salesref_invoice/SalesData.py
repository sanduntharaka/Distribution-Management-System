from .models import SalesRefInvoice
from datetime import datetime
from django.db.models.functions import ExtractMonth
import calendar


class SalesData:
    def __init__(self) -> None:
        self.months = SalesRefInvoice.objects.annotate(
            month=ExtractMonth('date')).values('month').distinct()
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

    def getData(self):
        invoices = []
        for i in self.months:
            invs = SalesRefInvoice.objects.filter(date__month=i['month'])
            total = sum([i.total - i.discount for i in invs])
            data = {
                'month': calendar.month_name[i['month']],
                'total': total
            }
            invoices.append(data)
        return sorted(invoices, key=lambda x: self.month_order[x["month"]])
