from django.db.models.signals import post_save
from django.dispatch import receiver
from distributor_inventory.models import DistributorInventory
# from salesref_inventory.models import SalesRefInventory
from userdetails.models import UserDetails


@receiver(post_save, sender=UserDetails)
def user_details_create_handler(sender, instance, created, *args, **kwargs):
    if created and instance.user.is_distributor:
        dis_inv = DistributorInventory(distributor=instance)
        dis_inv.save()
    # if created and instance.user.is_salesref:
    #     ref_inv = SalesRefInventory(sales_ref=instance)
    #     ref_inv.save()
