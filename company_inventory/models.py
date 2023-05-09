from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class CompanyInventory(models.Model):
    employee = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    item_code = models.CharField(max_length=50)
    description = models.TextField(null=True)
    base = models.CharField(max_length=250)
    qty = models.IntegerField(blank=False)
    pack_size = models.IntegerField(default=0)
    free_of_charge = models.FloatField(blank=False, default=0)
    whole_sale_price = models.FloatField(blank=False)
    retail_price = models.FloatField(blank=False)
    date = models.DateField(auto_created=True, default='2023-01-01')
