from django.contrib import admin
from .models import ExecutiveDistributor


class ExecutiveDistributorAdmin(admin.ModelAdmin):
    list_display = ('id', 'executive', 'distributor')
    list_display_links = ('id',)
    list_filter = ('executive',)
    search_fields = ('executive',)
    list_per_page = 25


admin.site.register(ExecutiveDistributor, ExecutiveDistributorAdmin)
