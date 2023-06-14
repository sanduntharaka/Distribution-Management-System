from django.db import models
from userdetails.models import UserDetails
from dealer_details.models import Dealer


class PastInvoice(models.Model):
    distributor = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    inv_date = models.DateField()
    inv_number = models.CharField(max_length=25)
    customer_name = models.ForeignKey(
        Dealer, on_delete=models.CASCADE, null=True, blank=True)
    original_amount = models.FloatField()
    paid_amount = models.FloatField()
    balance_amount = models.FloatField()
    date = models.DateField(auto_created=True, default="2023-06-14")


class PastCheque(models.Model):
    distributor = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    inv_date = models.DateField()
    inv_number = models.CharField(max_length=25)
    cheque_number = models.CharField(max_length=25)
    bank = models.CharField(max_length=50)
    cheque_deposite_date = models.DateField()
    customer_name = models.ForeignKey(
        Dealer, on_delete=models.CASCADE, null=True, blank=True)
    original_amount = models.FloatField()
    paid_amount = models.FloatField()
    balance_amount = models.FloatField()
    date = models.DateField(auto_created=True, default="2023-06-14")
