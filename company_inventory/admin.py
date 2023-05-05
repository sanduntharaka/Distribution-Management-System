from django.contrib import admin
from .models import CompanyInventory


class CompanyInventoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'item_code', 'qty',
                    'whole_sale_price', 'retail_price')
    list_display_links = ('id', 'item_code')
    list_filter = ('item_code', 'employee',
                   'whole_sale_price', 'retail_price')
    search_fields = ('item_code', 'employee')
    list_per_page = 25


admin.site.register(CompanyInventory, CompanyInventoryAdmin)
