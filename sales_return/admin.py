from django.contrib import admin
from .models import SalesReturn, SalesReturnItem


class SalesReturnAdmin(admin.ModelAdmin):
    list_display = ('id', 'dealer',
                    'is_return_goods', 'is_deduct_bill', 'added_by')
    list_display_links = ('id',)
    list_filter = ('dealer', )
    search_fields = ('dealer',)
    list_per_page = 25


admin.site.register(SalesReturn, SalesReturnAdmin)


class SalesReturnItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'salesreturn', 'item', 'qty', 'foc', 'reason')
    list_display_links = ('id',)
    list_filter = ('salesreturn', )
    search_fields = ('item',)
    list_per_page = 25


admin.site.register(SalesReturnItem, SalesReturnItemsAdmin)
