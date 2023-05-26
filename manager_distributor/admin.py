from django.contrib import admin
from .models import ManagerDistributor


class ManagerDistributorAdmin(admin.ModelAdmin):
    list_display = ('id', 'distributor', 'manager')
    list_display_links = ('id',)
    list_filter = ('manager',)
    search_fields = ('manager',)
    list_per_page = 25


admin.site.register(ManagerDistributor, ManagerDistributorAdmin)
