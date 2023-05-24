from django.utils.timezone import now
from django.db import models
from dealer_details.models import Dealer
from django.conf import settings
User = settings.AUTH_USER_MODEL


class NotBuyDetails(models.Model):
    dealer = models.ForeignKey(Dealer, on_delete=models.CASCADE)
    # date = models.DateField()
    # time = models.TimeField(default="12:0:0")
    datetime = models.DateTimeField(default=now)
    is_only_our = models.BooleanField(default=False)
    is_competitor = models.BooleanField(default=False)
    is_payment_problem = models.BooleanField(default=False)
    is_dealer_not_in = models.BooleanField(default=False)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
