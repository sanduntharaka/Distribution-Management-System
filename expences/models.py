from django.db import models
from distributor_inventory.models import DistributorInventory
from userdetails.models import UserDetails


class Expense(models.Model):
    EXPENCE_TYPE = (
        ('diesel', 'diesel'),
        ('vehicle-repair', 'vehicle-repair'),
        ('tokens', 'tokens'),
        ('cheque-returns', 'cheque-returns'),
        ('driver-salary', 'driver-salary'),
        ('others', 'others'),

    )

    name = models.CharField(choices=EXPENCE_TYPE,
                            max_length=100, default='others')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    reason = models.TextField()
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE)
    added_by = models.ForeignKey(UserDetails, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
