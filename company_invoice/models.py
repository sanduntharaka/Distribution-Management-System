from django.db import models
from userdetails.models import UserDetails
from django.conf import settings
User = settings.AUTH_USER_MODEL


class CompanyInvoice(models.Model):
    invoice_code = models.CharField(max_length=10)
    invoice_number = models.IntegerField(unique=True)
    issued_by = models.ForeignKey(User, on_delete=models.CASCADE)
    solled_to = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    date = models.DateField()

    def get_invoice_number(self):
        return self.invoice_code + str(self.invoice_number)


class CompanyInvoiceItems(models.Model):
    invoice = models.ForeignKey(CompanyInvoice, on_delete=models.PROTECT)
    item = models.CharField(max_length=15)
    description = models.CharField(max_length=255, default="ABC")
    qty = models.IntegerField()
    foc = models.IntegerField()
    unit_price = models.FloatField()
    whole_price = models.FloatField()
