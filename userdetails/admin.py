from django.contrib import admin
from .models import UserDetails


class UserDetailAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'designation',
                    'dob', 'personal_number', 'terriotory')
    list_display_links = ('user', 'full_name')
    list_filter = ('user', 'full_name', 'designation', 'terriotory')
    search_fields = ('designation', 'terriotory')
    list_per_page = 25


admin.site.register(UserDetails, UserDetailAdmin)
