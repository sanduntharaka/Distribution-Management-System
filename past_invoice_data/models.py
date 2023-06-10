from django.db import models
from userdetails.models import UserDetails


class PastInvoice(models.Model):
    distributor = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    inv_date = models.DateField()
    inv_number = models.CharField(max_length=25)
    customer_name = models.CharField(max_length=150)
    original_amount = models.FloatField()
    paid_amount = models.FloatField()
    balance_amount = models.FloatField()


class PastCheque(models.Model):
    distributor = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    inv_date = models.DateField()
    inv_number = models.CharField(max_length=25)
    cheque_number = models.CharField(max_length=25)
    bank = models.CharField(max_length=50)
    cheque_deposite_date = models.DateField()
    customer_name = models.CharField(max_length=150)
    original_amount = models.FloatField()
    paid_amount = models.FloatField()
    balance_amount = models.FloatField()
