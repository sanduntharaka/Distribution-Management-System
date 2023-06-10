from distrubutor_salesref_invoice.models import SalesRefInvoice
from datetime import datetime, timedelta


class CountSalesInvoiceAll:
    def __init__(self, date) -> None:
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        previous_date = date_obj - timedelta(days=1)
        previous_date_str = previous_date.strftime('%Y-%m-%d')
        self.invoices = SalesRefInvoice.objects.filter(date=date).all()
        self.previnvoices = SalesRefInvoice.objects.filter(
            date=previous_date_str).all()

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
