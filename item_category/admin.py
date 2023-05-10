from django.contrib import admin
from .models import Category


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'category_name', 'description', 'date', 'added_by')
    list_display_links = ('id', 'category_name')
    list_per_page = 25


admin.site.register(Category, CategoryAdmin)
