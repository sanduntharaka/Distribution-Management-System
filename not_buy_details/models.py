from userdetails.models import UserDetails
from django.utils.timezone import now
from django.db import models
from dealer_details.models import Dealer
from django.conf import settings
from distributor_inventory.models import DistributorInventory
from distrubutor_salesref.models import SalesRefDistributor
User = settings.AUTH_USER_MODEL


class NotBuyDetails(models.Model):
    dis_sales_ref = models.ForeignKey(
        SalesRefDistributor, on_delete=models.CASCADE, null=True, blank=True)
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE, null=True, blank=True)
    dealer = models.ForeignKey(Dealer, on_delete=models.CASCADE)
    datetime = models.DateTimeField(default=now)
    is_only_our = models.BooleanField(default=False)
    is_competitor = models.BooleanField(default=False)
    is_payment_problem = models.BooleanField(default=False)
    is_dealer_not_in = models.BooleanField(default=False)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    def get_reson(self):
        reason = ""
        if self.is_only_our:

            reason += " Only have our goods."
        if self.is_competitor:
            reason += " Only have competitor goods."
        if self.is_payment_problem:
            reason += " Payment problems."
        if self.is_dealer_not_in:
            reason += " Dealer not in."

        return reason

    def get_added_by_name(self):
        return UserDetails.objects.get(user=self.added_by).full_name
