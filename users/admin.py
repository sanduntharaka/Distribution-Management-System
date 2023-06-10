from django.contrib import admin
from .models import UserAccount


class UserAccountsAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'is_active',
                    'is_staff', 'is_companyStaff', 'is_manager', 'is_distributor', 'is_salesref', 'is_superuser', 'last_login')
    list_display_links = ('user_name', )
    list_per_page = 25


admin.site.register(UserAccount, UserAccountsAdmin)
