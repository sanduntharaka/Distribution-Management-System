from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class PrimarySalesArea(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    area_name = models.CharField(max_length=250, null=False)
    more_details = models.TextField(null=True, blank=True)
