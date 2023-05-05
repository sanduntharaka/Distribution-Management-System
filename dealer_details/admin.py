from django.contrib import admin
from .models import Dealer


class DealerDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'added_by', 'name', 'owner_name',
                    'company_number', 'assistant_name')

    list_display_links = ('id', 'name')
    list_filter = ('added_by', 'owner_name',)
    search_fields = ('name', 'added_by')
    list_per_page = 25


admin.site.register(Dealer, DealerDetailsAdmin)
