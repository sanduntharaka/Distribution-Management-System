from django.db import models
from userdetails.models import UserDetails
from django.conf import settings
User = settings.AUTH_USER_MODEL


class SalesRefDistributor(models.Model):
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    distributor = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='distributor')
    sales_ref = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='sales_ref')
