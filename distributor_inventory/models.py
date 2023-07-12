from django.db import models
from django.conf import settings
from userdetails.models import UserDetails
from item_category.models import Category
User = settings.AUTH_USER_MODEL


class DistributorInventory(models.Model):
    distributor = models.OneToOneField(
        UserDetails, on_delete=models.DO_NOTHING)
    date = models.DateField(auto_now_add=True)


class DistributorInventoryItems(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE)
    item_code = models.CharField(max_length=50)
    description = models.TextField(null=True)
    base = models.CharField(max_length=250, null=True, blank=True)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    date = models.DateField(auto_now_add=True)

    def get_total_qty(self):
        return self.itemstock_set.aggregate(total_qty=models.Sum('qty'))['total_qty'] or 0

    def get_total_foc(self):
        return self.itemstock_set.aggregate(total_foc=models.Sum('foc'))['total_foc'] or 0


class ItemStock(models.Model):
    item = models.ForeignKey(DistributorInventoryItems,
                             on_delete=models.CASCADE)
    from_sales_return = models.BooleanField(default=False)
    invoice_number = models.CharField(max_length=15, default='INV-0000')
    qty = models.IntegerField(blank=False)
    pack_size = models.IntegerField(default=0)
    foc = models.FloatField(blank=False, default=0)
    whole_sale_price = models.FloatField(blank=False)
    retail_price = models.FloatField(blank=False)
    date = models.DateField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    def get_qty_wholesale_multiple(self):
        return self.qty*self.whole_sale_price
