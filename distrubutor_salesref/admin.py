from django.contrib import admin
from .models import SalesRefDistributor


class DistributorSalesRefAdmin(admin.ModelAdmin):
    list_display = ('id', 'distributor', 'sales_ref')
    list_display_links = ('id',)
    list_filter = ('distributor',)
    search_fields = ('distributor',)
    list_per_page = 25


admin.site.register(SalesRefDistributor, DistributorSalesRefAdmin)
