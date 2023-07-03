from django.db import models
from userdetails.models import UserDetails
from django.conf import settings
User = settings.AUTH_USER_MODEL


class ExecutiveManager(models.Model):
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    executive = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='executive')
    manager = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='ex_manager')
