from datetime import datetime, timedelta
from reportdata.models import DailyReport, SalesData, FocData, MarketReturnData
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem, Item, PaymentDetails
from userdetails.models import UserDetails
from item_category.models import Category
from salesref_return.models import SalesRefReturn, SalesRefReturnItem

today = datetime.today()
yesterday = today - timedelta(days=1)


def autoCreateCumulativeDetails():
    sales_refs = UserDetails.objects.filter(designation='Sales Rep')

    categories = Category.objects.all()
    for sales_ref in sales_refs:
        filters = {
            'date': yesterday,
            'added_by': sales_ref
        }
        invoice_list = SalesRefInvoice.objects.filter(
            **filters)

        details = {
            'sales_ref': sales_ref,
            'date': yesterday,
            'amount': sum([invoice.total if invoice.is_settiled == False else 0 for invoice in invoice_list]),
            'total': sum([i.total for i in invoice_list])
        }
        daily = DailyReport(**details)
        daily.save()
        for category in categories:

            bill_items = Item.objects.filter(item__item__category=category, invoice_item__bill__dis_sales_ref__sales_ref=sales_ref,
                                             invoice_item__bill__date=yesterday, invoice_item__bill__in=invoice_list)

            maket_return_items = SalesRefReturnItem.objects.filter(
                item__item__category=category, salesrefreturn__dis_sales_ref__sales_ref=sales_ref, salesrefreturn__date=yesterday)

            sale_sum = sum(
                [bil_item.foc+bil_item.qty for bil_item in bill_items])

            SalesData(report=daily, category=category, value=sale_sum).save()

            foc_sum = sum(
                [bil_item.foc for bil_item in bill_items])

            FocData(report=daily, category=category, value=foc_sum).save()

            mret_sum = sum(
                [mk_item.foc+mk_item.qty for mk_item in maket_return_items])

            MarketReturnData(report=daily, category=category,
                             value=mret_sum).save()

            # f = open("./logs/daily_report/logs.txt", "a")
            # f.write(f"{yesterday} added sre: {sales_ref.full_name}\n")
            # f.close()
