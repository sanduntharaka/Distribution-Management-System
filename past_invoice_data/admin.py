from django.contrib import admin
from .models import PastInvoice, PastCheque


class PastInvoiceAdmin(admin.ModelAdmin):
    list_display = ('inv_date', 'inv_number', 'customer_name',
                    'original_amount', 'paid_amount', 'balance_amount')
    list_display_links = ('inv_number', 'inv_date',)
    list_filter = ('inv_number', )
    search_fields = ('inv_number',)
    list_per_page = 25


admin.site.register(PastInvoice, PastInvoiceAdmin)


class PastChequeAdmin(admin.ModelAdmin):
    list_display = ('inv_date', 'inv_number', 'customer_name', 'cheque_number', 'bank',
                    'cheque_deposite_date', 'original_amount', 'paid_amount', 'balance_amount')
    list_display_links = ('inv_number', 'inv_date',)
    list_filter = ('inv_number', )
    search_fields = ('inv_number',)
    list_per_page = 25


admin.site.register(PastCheque, PastChequeAdmin)
