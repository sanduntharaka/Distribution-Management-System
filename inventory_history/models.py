from django.db import models
from distributor_inventory.models import ItemStock


class DistributorHistoryItem(models.Model):
    item = models.ForeignKey(ItemStock,
                             on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    qty = models.IntegerField()
    foc = models.IntegerField()
