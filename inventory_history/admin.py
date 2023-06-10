from django.contrib import admin
from .models import DistributorHistoryItem


class DistributorInventoryItemHistoryAdmin(admin.ModelAdmin):
    list_display = ('item', 'date', 'qty', 'foc')
    list_per_page = 25


admin.site.register(DistributorHistoryItem,
                    DistributorInventoryItemHistoryAdmin)
