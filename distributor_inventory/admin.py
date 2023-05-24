from django.contrib import admin
from .models import DistributorInventory, DistributorInventoryItems


class DistributorInventoryAdmin(admin.ModelAdmin):
    list_display = ('distributor', 'date')
    list_display_links = ('distributor',)
    list_filter = ('distributor', 'date')
    search_fields = ('distributor',)
    list_per_page = 25


admin.site.register(DistributorInventory, DistributorInventoryAdmin)


class DistributorInventoryItemsAdmin(admin.ModelAdmin):
    list_display = ('inventory', 'item_code', 'qty', 'foc', 'added_by',
                    'description', 'pack_size', 'whole_sale_price', 'retail_price', 'invoice_number')
    list_display_links = ('inventory', 'item_code',)
    list_filter = ('inventory', 'added_by')
    search_fields = ('inventory',)
    list_per_page = 25


admin.site.register(DistributorInventoryItems, DistributorInventoryItemsAdmin)
