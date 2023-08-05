from django.contrib import admin
from .models import SalesRefInvoice, InvoiceIntem, ChequeDetails, PaymentDetails,Item


class SalesRefInvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill_code', 'bill_number', 'dealer', 'dis_sales_ref', 'date',
                    'total_discount', 'total')
    list_display_links = ('id', 'bill_code', 'bill_number')
    list_filter = ('added_by',
                   'dis_sales_ref', 'date')
    search_fields = ('dealer', 'bill_number', 'date')
    list_per_page = 25


admin.site.register(SalesRefInvoice, SalesRefInvoiceAdmin)


class SalesRefInvoiceItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill', 'item_code', 'description', 'qty', 'foc', 'pack_size',
                    'price', 'extended_price')
    list_display_links = ('id', 'item_code')
    search_fields = ('id', 'item_code')
    list_per_page = 25


admin.site.register(InvoiceIntem, SalesRefInvoiceItemAdmin)

class SalesRefInvoiceItemItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'invoice_item', 'item', 'qty', 'foc', )
    list_display_links = ('id',)
    list_per_page = 25


admin.site.register(Item, SalesRefInvoiceItemItemsAdmin)


class PaymentDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill', 'payment_type',  'paid_amount',
                    'date', 'due_date')
    list_display_links = ('id', 'bill')
    search_fields = ('id', 'bill')
    list_per_page = 25


admin.site.register(PaymentDetails, PaymentDetailsAdmin)


class ChequeAdmin(admin.ModelAdmin):
    list_display = ('id', 'cheque_number', 'payment_details',
                    'payee_name', 'amount', 'date', 'deposited_at', 'status')
    list_display_links = ('id', 'cheque_number')
    search_fields = ('id', 'payment_details')
    list_per_page = 25


admin.site.register(ChequeDetails, ChequeAdmin)
