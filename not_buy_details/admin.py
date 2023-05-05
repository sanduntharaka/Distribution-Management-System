from django.contrib import admin

from .models import NotBuyDetails


class NotBuyDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'dealer', 'date', 'is_only_our', 'is_competitor',
                    'is_payment_problem', 'is_dealer_not_in', 'added_by')
    list_display_links = ('id', )
    list_filter = ('dealer', 'added_by', 'is_competitor',
                   'is_payment_problem', 'is_dealer_not_in')
    search_fields = ('dealer',)
    list_per_page = 25


admin.site.register(NotBuyDetails, NotBuyDetailsAdmin)
