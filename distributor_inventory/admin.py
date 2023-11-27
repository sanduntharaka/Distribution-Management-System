from django.contrib import admin
from .models import DistributorInventory, DistributorInventoryItems, ItemStock, DistributorItemsInvoice


class DistributorInventoryAdmin(admin.ModelAdmin):
    list_display = ('distributor', 'date')
    list_display_links = ('distributor',)
    list_filter = ('distributor', 'date')
    search_fields = ('distributor',)
    list_per_page = 25


admin.site.register(DistributorInventory, DistributorInventoryAdmin)


class DistributorInventoryItemsAdmin(admin.ModelAdmin):
    list_display = ('inventory', 'item_code', 'added_by',
                    'description',  'date')
    list_display_links = ('inventory', 'item_code',)
    list_filter = ('inventory', 'added_by')
    search_fields = ('inventory',)
    list_per_page = 25


admin.site.register(DistributorInventoryItems, DistributorInventoryItemsAdmin)


class DistributorItemsInvoiceAdmin(admin.ModelAdmin):
    list_display = ('inventory', 'invoice_number', 'date')
    list_display_links = ('inventory', 'invoice_number',)
    list_filter = ('inventory', 'invoice_number')
    search_fields = ('inventory',)
    list_per_page = 25


admin.site.register(DistributorItemsInvoice, DistributorItemsInvoiceAdmin)


class ItemDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'qty', 'foc', 'pack_size',
                    'whole_sale_price', 'retail_price', 'date', )
    list_display_links = ('item', 'id',)
    list_filter = ('item', 'date')
    search_fields = ('item',)
    list_per_page = 25


admin.site.register(ItemStock, ItemDetailsAdmin)
