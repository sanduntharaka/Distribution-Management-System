from django.db import models
from distributor_inventory.models import DistributorInventory
from userdetails.models import UserDetails


class Expense(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    reason = models.TextField()
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE)
    added_by = models.ForeignKey(UserDetails, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
