from primary_sales_area.models import PrimarySalesArea
from django.db import models
from userdetails.models import UserDetails
from manager_distributor.models import ManagerDistributor
from distrubutor_salesref.models import SalesRefDistributor
from item_category.models import Category
from django.conf import settings
User = settings.AUTH_USER_MODEL


class DistributorTargets(models.Model):
    manager_distributor = models.ForeignKey(
        ManagerDistributor, on_delete=models.CASCADE)
    date_form = models.DateField()
    date_to = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.FloatField()
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)


class SalesrefTargets(models.Model):
    salesrep_distributor = models.ForeignKey(
        SalesRefDistributor, on_delete=models.CASCADE)
    target_person = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, null=True, blank=True)
    date_form = models.DateField()
    date_to = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    foc = models.IntegerField(blank=True, null=True)
    qty = models.IntegerField(blank=True, null=True)

    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)


class SalesrefValueTarget(models.Model):
    target_person = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, null=True, blank=True)
    date_form = models.DateField()
    date_to = models.DateField()
    value = models.FloatField()
    added_by = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, null=True, blank=True)


class SalesrepDailyValueTarget(models.Model):
    salesrep = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    date = models.DateField()
    value = models.FloatField()
    psa = models.ForeignKey(PrimarySalesArea, on_delete=models.CASCADE)
    added_by = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, null=True, blank=True)
