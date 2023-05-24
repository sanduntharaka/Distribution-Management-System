from django.contrib import admin
from .models import SalesRefInvoice, InvoiceIntem, ChequeDetails


class SalesRefInvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill_code', 'bill_number', 'dealer', 'dis_sales_ref', 'date',
                    'discount', 'total')
    list_display_links = ('id', 'bill_code', 'bill_number')
    list_filter = ('dealer', 'added_by',
                   'dis_sales_ref')
    search_fields = ('dealer', 'bill_number')
    list_per_page = 25


admin.site.register(SalesRefInvoice, SalesRefInvoiceAdmin)


class SalesRefInvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill', 'item_code', 'description', 'qty', 'foc', 'pack_size',
                    'price', 'extended_price')
    list_display_links = ('id', 'item_code')
    search_fields = ('id', 'item_code')
    list_per_page = 25


admin.site.register(InvoiceIntem, SalesRefInvoiceItemAdmin)


class ChequeAdmin(admin.ModelAdmin):
    list_display = ('id', 'cheque_number', 'bill',  'account_number',
                    'payee_name', 'amount', 'date', 'deposited_at', 'status')
    list_display_links = ('id', 'cheque_number')
    search_fields = ('id', 'bill')
    list_per_page = 25


admin.site.register(ChequeDetails, ChequeAdmin)
