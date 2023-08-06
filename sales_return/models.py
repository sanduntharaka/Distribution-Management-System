from django.db import models
from distributor_inventory.models import DistributorInventoryItems, ItemStock, DistributorInventory
from distrubutor_salesref.models import SalesRefDistributor
from primary_sales_area.models import PrimarySalesArea
from dealer_details.models import Dealer
from userdetails.models import UserDetails


class SalesReturn(models.Model):
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
    bill_code = models.CharField(max_length=10, default='SRET-')
    bill_number = models.IntegerField(default=0)
    amount = models.FloatField(default=0)
    date = models.DateField()
    added_by = models.ForeignKey(UserDetails,
                                 on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')

    def getbillnumber(self):
        return str(self.bill_code)+str(self.bill_number)


class SalesReturnItem(models.Model):
    salesreturn = models.ForeignKey(SalesReturn,
                                    on_delete=models.CASCADE)
    item = models.ForeignKey(ItemStock,
                             on_delete=models.CASCADE,blank=True,null=True)
    inventory_item = models.ForeignKey(DistributorInventoryItems,
                             on_delete=models.CASCADE,blank=True,null=True)
    qty = models.IntegerField()
    reason = models.TextField()
    foc = models.IntegerField(default=0)
    whole_sale_price = models.FloatField(blank=True,null=True)
    retail_price = models.FloatField(blank=True,null=True)
    initial_qty = models.IntegerField(blank=True, default=0)
    initial_foc = models.IntegerField(blank=True, default=0)

    def total(self):
        return self.qty*self.item.retail_price
