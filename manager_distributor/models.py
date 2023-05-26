from django.db import models
from userdetails.models import UserDetails
from django.conf import settings
User = settings.AUTH_USER_MODEL


class ManagerDistributor(models.Model):
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    distributor = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='main_distributor')
    manager = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='manager')
