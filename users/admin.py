from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import UserAccount


class CustomUserAdmin(UserAdmin):
    model = UserAccount
    list_display = ('user_name', 'is_active', 'is_staff', 'is_company',
                    'is_manager', 'is_distributor', 'is_salesref', 'is_superuser')
    list_display_links = ('user_name', )
    list_per_page = 25
    ordering = ('user_name',)

    actions = ['update_password']

    def update_password(self, request, queryset):
        for user in queryset:
            user.set_password(UserAccount.objects.make_random_password())
            user.save()
        self.message_user(request, _(
            'Passwords were successfully updated for selected users.'))

    update_password.short_description = _('Update password for selected users')

    fieldsets = (
        (None, {'fields': ('user_name', 'password')}),
        (_('Permissions'), {
         'fields': ('is_active', 'is_staff', 'is_superuser')}),
        # Add other fields as needed
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('user_name', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser'),
        }),
        # Add other fields as needed
    )


admin.site.register(UserAccount, CustomUserAdmin)
