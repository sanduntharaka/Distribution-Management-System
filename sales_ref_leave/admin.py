from django.contrib import admin
from .models import SalesRefLeave


class SalesRefLeaveAdmin(admin.ModelAdmin):
    list_display = ('id', 'salesref', 'leave_apply_date',
                    'leave_end_date', 'number_of_dates', 'reason', 'approved')
    list_display_links = ('id', 'salesref')
    list_filter = ('salesref', 'created_by')
    search_fields = ('salesref',)
    list_per_page = 25


admin.site.register(SalesRefLeave, SalesRefLeaveAdmin)
