from distrubutor_salesref.models import SalesRefDistributor
from django.db import models
from distributor_inventory.models import DistributorInventoryItems, ItemStock, DistributorInventory
from primary_sales_area.models import PrimarySalesArea
from dealer_details.models import Dealer
from userdetails.models import UserDetails


class SalesRefReturn(models.Model):
    STATUS = (
        ('approved', 'approved'),
        ('pending', 'pending'),
        ('rejected', 'rejected'),
    )
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE, blank=True, null=True)
    dis_sales_ref = models.ForeignKey(
        SalesRefDistributor, on_delete=models.CASCADE)
    dealer = models.ForeignKey(Dealer,
                               on_delete=models.CASCADE)
    psa = models.ForeignKey(PrimarySalesArea,
                            on_delete=models.CASCADE)
    is_return_goods = models.BooleanField(default=False)
    is_deduct_bill = models.BooleanField(default=False)
    bill_code = models.CharField(max_length=10, default='MRET-')
    bill_number = models.IntegerField(default=0)
    amount = models.FloatField(default=0)
    date = models.DateField()
    added_by = models.ForeignKey(UserDetails,
                                 on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')

    def getbillnumber(self):
        return str(self.bill_code)+str(self.bill_number)


class SalesRefReturnItem(models.Model):
    salesrefreturn = models.ForeignKey(SalesRefReturn,
                                       on_delete=models.CASCADE)
    item = models.ForeignKey(ItemStock,
                             on_delete=models.CASCADE)
    qty = models.IntegerField()
    foc = models.IntegerField()
    reason = models.TextField()

    def total(self):
        return self.qty*self.item.retail_price
