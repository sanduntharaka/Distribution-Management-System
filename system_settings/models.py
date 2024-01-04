from django.db import models


class SystemSettings(models.Model):
    hr_email = models.EmailField()
    vat_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.00)

    def __str__(self) -> str:
        return self.hr_email
