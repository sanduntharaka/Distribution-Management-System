from django.db import models
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventoryItems
from dealer_details.models import Dealer
from primary_sales_area.models import PrimarySalesArea
from django.conf import settings
User = settings.AUTH_USER_MODEL


class SalesRefInvoice(models.Model):
    BILL_STATUS = (
        ('confirmed', 'confirmed'),
        ('rejected', 'rejected'),
        ('pending', 'pending'),
    )
    dis_sales_ref = models.ForeignKey(
        SalesRefDistributor, on_delete=models.CASCADE)
    date = models.DateField()
    bill_code = models.CharField(max_length=10)
    bill_number = models.IntegerField()
    dealer = models.ForeignKey(Dealer, on_delete=models.CASCADE)
    total = models.FloatField()
    discount = models.IntegerField()
    payment_type = models.CharField(max_length=10, default='cash')
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    billing_price_method = models.CharField(default='2', max_length=2)
    sub_total = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=10, choices=BILL_STATUS, default='pending')

    def get_bill_code_number_combine(self):
        return self.bill_code + str(self.bill_number)


class ChequeDetails(models.Model):
    CHEQUE_STATUS = (
        ('cleared', 'cleared'),
        ('pending', 'pending'),
        ('return', 'return'),
    )
    bill = models.OneToOneField(SalesRefInvoice, on_delete=models.CASCADE)
    cheque_number = models.CharField(max_length=50)
    account_number = models.CharField(max_length=50)
    payee_name = models.CharField(max_length=150)
    amount = models.FloatField()
    date = models.DateField()
    deposited_at = models.DateField(default='2020-01-01')
    status = models.CharField(
        max_length=10, choices=CHEQUE_STATUS, default='pending')


class InvoiceIntem(models.Model):
    bill = models.ForeignKey(SalesRefInvoice, on_delete=models.CASCADE)
    item = models.ForeignKey(DistributorInventoryItems,
                             default=1, on_delete=models.DO_NOTHING)
    item_code = models.CharField(max_length=50)
    description = models.TextField(null=True)
    qty = models.IntegerField(blank=False)
    foc = models.FloatField(blank=False, default=0)
    pack_size = models.IntegerField(default=0)
    price = models.FloatField(blank=False, default="0")
    extended_price = models.FloatField(blank=False, default="0")
