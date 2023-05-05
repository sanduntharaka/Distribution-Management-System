from django.db import models
from distributor_inventory.models import DistributorInventoryItems
from primary_sales_area.models import PrimarySalesArea
from dealer_details.models import Dealer
from django.conf import settings
User = settings.AUTH_USER_MODEL


class SalesRefReturn(models.Model):
    dealer = models.ForeignKey(Dealer,
                               on_delete=models.CASCADE)
    psa = models.ForeignKey(PrimarySalesArea,
                            on_delete=models.CASCADE)
    is_return_goods = models.BooleanField(default=False)
    is_deduct_bill = models.BooleanField(default=False)
    bill_code = models.CharField(max_length=10, default='IN')
    bill_number = models.IntegerField(default=0)
    amount = models.FloatField(default=0)
    date = models.DateField()
    added_by = models.ForeignKey(User,
                                 on_delete=models.CASCADE)


class SalesRefReturnItem(models.Model):
    salesrefreturn = models.ForeignKey(SalesRefReturn,
                                       on_delete=models.CASCADE)
    item = models.ForeignKey(DistributorInventoryItems,
                             on_delete=models.CASCADE)
    qty = models.IntegerField()
    foc = models.IntegerField()
    reason = models.TextField()
