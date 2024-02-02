from django.contrib import admin
from .models import SalesRoute, DailyStatus

admin.site.register(DailyStatus)


class SalesRoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'salesref',
                    'date', 'is_approved', 'created_at', 'updated_at', 'approved_by')
    list_display_links = ('id', 'salesref')
    list_filter = ('date', 'is_approved')
    search_fields = ('date',)
    list_per_page = 25


admin.site.register(SalesRoute, SalesRoteAdmin)
