from django.db import models
from userdetails.models import UserDetails
from django.contrib.postgres.fields import ArrayField


class SalesRoute(models.Model):
    salesref = models.ForeignKey(UserDetails, on_delete=models.CASCADE)
    dealers = ArrayField(models.IntegerField())
