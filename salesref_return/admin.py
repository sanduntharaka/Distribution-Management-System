from django.contrib import admin
from .models import SalesRefReturn, SalesRefReturnItem


class SalesRefReturnAdmin(admin.ModelAdmin):
    list_display = ('id', 'dealer',
                    'is_return_goods', 'is_deduct_bill', 'added_by')
    list_display_links = ('id',)
    list_filter = ('dealer', )
    search_fields = ('dealer',)
    list_per_page = 25


admin.site.register(SalesRefReturn, SalesRefReturnAdmin)


class SalesRefReturnItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'salesrefreturn', 'item', 'qty', 'foc', 'reason')
    list_display_links = ('id',)
    list_filter = ('salesrefreturn', )
    search_fields = ('item',)
    list_per_page = 25


admin.site.register(SalesRefReturnItem, SalesRefReturnItemsAdmin)
