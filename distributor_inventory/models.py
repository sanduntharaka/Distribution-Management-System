from django.db import models
from django.conf import settings
from userdetails.models import UserDetails
from company_inventory.models import CompanyInventory
User = settings.AUTH_USER_MODEL


class DistributorInventory(models.Model):
    distributor = models.OneToOneField(
        UserDetails, on_delete=models.DO_NOTHING)
    date = models.DateField(auto_now_add=True)


class DistributorInventoryItems(models.Model):
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE)
    # item = models.ForeignKey(CompanyInventory, on_delete=models.DO_NOTHING)
    # qty = models.IntegerField()
    # foc = models.IntegerField(default=0)
    item_code = models.CharField(max_length=50, default="0")
    description = models.TextField(null=True, default="aaaaa")
    base = models.CharField(max_length=250, default="0")
    qty = models.IntegerField(blank=False, default="0")
    pack_size = models.IntegerField(default=0)
    foc = models.FloatField(blank=False, default=0)
    whole_sale_price = models.FloatField(blank=False, default="0")
    retail_price = models.FloatField(blank=False, default="0")
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
