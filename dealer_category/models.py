from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class DealerCategory(models.Model):
    category_name = models.CharField(max_length=50)
    details = models.CharField(max_length=255, null=True, blank=True)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
