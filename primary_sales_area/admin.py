from django.contrib import admin
from .models import PrimarySalesArea


class PrimarySalesAreaAdmin(admin.ModelAdmin):
    list_display = ('id', 'area_name', 'created_by', 'more_details')
    list_display_links = ('id', 'area_name')
    list_filter = ('created_by', )
    search_fields = ('area_name',)
    list_per_page = 25


admin.site.register(PrimarySalesArea, PrimarySalesAreaAdmin)
