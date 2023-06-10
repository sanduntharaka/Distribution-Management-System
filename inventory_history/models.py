from django.db import models
from distributor_inventory.models import DistributorInventory, DistributorInventoryItems


class DistributorHistoryItem(models.Model):
    item = models.ForeignKey(DistributorInventoryItems,
                             on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    qty = models.IntegerField()
    foc = models.IntegerField()
