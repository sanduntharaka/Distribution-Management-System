from django.contrib import admin
from .models import UserDetails, Terriotory, UserTerriotory


class UserDetailAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'designation',
                    'dob', 'personal_number')
    list_display_links = ('user', 'full_name')
    list_filter = ('user', 'full_name', 'designation')
    search_fields = ('designation', )
    list_per_page = 25


admin.site.register(UserDetails, UserDetailAdmin)


class TerriotoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'terriotory_name', 'code',)
    list_display_links = ('id',)
    list_per_page = 25


admin.site.register(Terriotory, TerriotoryAdmin)


class UserTerriotoryAdmin(admin.ModelAdmin):
    list_display = ('user_detail', 'territory',)
    list_display_links = ('user_detail',)
    list_per_page = 25


admin.site.register(UserTerriotory, UserTerriotoryAdmin)
