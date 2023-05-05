from django.db import models


class CompanyInvoice(models.Model):
    invoice_code = models.CharField(max_length=10)
    invoice_number = models.IntegerField(unique=True)
    issued_by = models.CharField(max_length=150)
    solled_to = models.CharField(max_length=150)
    date = models.DateField()


class CompanyInvoiceItems(models.Model):
    invoice = models.ForeignKey(CompanyInvoice, on_delete=models.DO_NOTHING)
    item = models.CharField(max_length=15)
    description = models.CharField(max_length=255, default="ABC")
    qty = models.IntegerField()
    foc = models.IntegerField()
    unit_price = models.FloatField()
    whole_price = models.FloatField()
