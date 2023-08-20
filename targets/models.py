from django.db import models
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
    date_form = models.DateField()
    date_to = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.FloatField()
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
