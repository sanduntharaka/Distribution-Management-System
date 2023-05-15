from django.contrib import admin
from .models import DealerCategory


class DealerDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'category_name', 'details', 'added_by')
    list_display_links = ('id', 'category_name')
    list_filter = ('added_by', )
    search_fields = ('category_name',)
    list_per_page = 25


admin.site.register(DealerCategory, DealerDetailsAdmin)
