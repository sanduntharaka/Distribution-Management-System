from django.contrib import admin
from .models import CompanyProducts


class CompanyProductsAdmin(admin.ModelAdmin):
    list_display = ('id', 'item_code', 'base', 'description')
    list_display_links = ('id', 'item_code')
    list_filter = ('item_code', )
    search_fields = ('item_code', 'description')
    list_per_page = 25


admin.site.register(CompanyProducts, CompanyProductsAdmin)
