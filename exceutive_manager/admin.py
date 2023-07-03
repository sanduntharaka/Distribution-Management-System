from django.contrib import admin
from .models import ExecutiveManager


class ExecutiveManagerAdmin(admin.ModelAdmin):
    list_display = ('id', 'executive', 'manager')
    list_display_links = ('id',)
    list_filter = ('executive',)
    search_fields = ('executive',)
    list_per_page = 25


admin.site.register(ExecutiveManager, ExecutiveManagerAdmin)
