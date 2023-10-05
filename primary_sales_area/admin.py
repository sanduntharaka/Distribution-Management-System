from django.contrib import admin
from .models import PrimarySalesArea


class PrimarySalesAreaAdmin(admin.ModelAdmin):
    list_display = ('id', 'area_name', 'created_by',
                    'more_details', 'sales_ref')
    list_display_links = ('id', 'area_name')
    list_filter = ('created_by', 'sales_ref')
    search_fields = ('area_name',)
    list_per_page = 25


admin.site.register(PrimarySalesArea, PrimarySalesAreaAdmin)
