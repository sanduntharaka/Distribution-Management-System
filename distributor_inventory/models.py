import math
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
# class ItemInvoice(models.Model):
#     invoice_number = models.CharField(max_length=15, default='INV-0000')


class DistributorItemsInvoice(models.Model):
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=15, default='INV-0000')
    page_number = models.IntegerField(default=0)
    total = models.FloatField(default=0)
    discount = models.FloatField(default=0)
    due_date = models.DateField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)


class ItemStock(models.Model):
    invoice = models.ForeignKey(
        DistributorItemsInvoice, on_delete=models.CASCADE, blank=True, null=True)
    item = models.ForeignKey(DistributorInventoryItems,
                             on_delete=models.CASCADE)
    from_sales_return = models.BooleanField(default=False)
    from_market_return = models.BooleanField(default=False)
    invoice_number = models.CharField(
        max_length=15, default='INV-0000', blank=True, null=True)
    qty = models.IntegerField(blank=False)
    pack_size = models.IntegerField(default=0)
    foc = models.IntegerField(blank=False, default=0)
    whole_sale_price = models.FloatField(blank=False)
    retail_price = models.FloatField(blank=False)
    date = models.DateField(auto_now_add=True)
    # bill values when initially creating
    bill_qty = models.IntegerField(blank=True, default=0)
    bill_foc = models.IntegerField(blank=True, default=0)

    # distributor stocks count when creating a bill
    initial_qty = models.IntegerField(blank=True, default=0)
    initial_foc = models.IntegerField(blank=True, default=0)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    def get_qty_wholesale_multiple(self):
        value = (self.qty-self.foc)*self.whole_sale_price
        if math.isnan(value):
            return 0
        else:
            return value
