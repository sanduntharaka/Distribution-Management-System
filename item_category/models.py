from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


class Category(models.Model):
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    category_name = models.CharField(max_length=50, null=False)
    description = models.TextField(null=True, blank=True)
    foc_percentage = models.IntegerField(default=10)
    date = models.DateField(auto_now=True)
