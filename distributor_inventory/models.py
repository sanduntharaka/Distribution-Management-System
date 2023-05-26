from django.utils import timezone
from django.db import models
from django.conf import settings
from userdetails.models import UserDetails
from item_category.models import Category
from company_inventory.models import CompanyInventory
User = settings.AUTH_USER_MODEL


class DistributorInventory(models.Model):
    distributor = models.OneToOneField(
        UserDetails, on_delete=models.DO_NOTHING)
    date = models.DateField(auto_now_add=True)


class DistributorInventoryItems(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    invoice_number = models.CharField(max_length=15, default='IN000')
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE)
    item_code = models.CharField(max_length=50, default="0")
    description = models.TextField(null=True, default="aaaaa")
    base = models.CharField(max_length=250, null=True, blank=True)
    qty = models.IntegerField(blank=False, default="0")
    pack_size = models.IntegerField(default=0)
    foc = models.FloatField(blank=False, default=0)
    whole_sale_price = models.FloatField(blank=False, default="0")
    retail_price = models.FloatField(blank=False, default="0")
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    date = models.DateField(auto_now_add=True)
