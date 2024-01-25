from django.db import models
from userdetails.models import UserDetails
from item_category.models import Category


class DailyReport(models.Model):
    sales_ref = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.FloatField()
    total = models.FloatField()


class SalesData(models.Model):
    report = models.ForeignKey(DailyReport, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    value = models.IntegerField()


class FocData(models.Model):
    report = models.ForeignKey(DailyReport, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    value = models.IntegerField()


class MarketReturnData(models.Model):
    report = models.ForeignKey(DailyReport, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    value = models.IntegerField()
