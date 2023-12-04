from django.contrib import admin
# from .models import CompanyInvoice, CompanyInvoiceItems


# class CompanyInvoiceAdmin(admin.ModelAdmin):
#     list_display = ('id', 'invoice_code', 'invoice_number', 'total', 'issued_by',
#                     'solled_to', 'date')
#     list_display_links = ('id', 'invoice_number')
#     list_filter = ('invoice_code', 'invoice_number',
#                    'issued_by', 'date')
#     search_fields = ('invoice_number', 'issued_by')
#     list_per_page = 25


# admin.site.register(CompanyInvoice, CompanyInvoiceAdmin)


# class CompanyInvoiceItemsAdmin(admin.ModelAdmin):
#     list_display = ('id', 'invoice', 'item', 'qty',
#                     'foc', 'unit_price', 'whole_price')
#     list_display_links = ('id', 'invoice', 'item')
#     list_filter = ('item', 'invoice')
#     search_fields = ('item', 'invoice')
#     list_per_page = 25


# admin.site.register(CompanyInvoiceItems, CompanyInvoiceItemsAdmin)
