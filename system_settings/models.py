from django.db import models


class SystemSettings(models.Model):
    hr_email = models.EmailField()

    def __str__(self) -> str:
        return self.hr_email
