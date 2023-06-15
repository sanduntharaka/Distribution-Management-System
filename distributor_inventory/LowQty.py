from .models import DistributorInventory, DistributorInventoryItems
from distrubutor_salesref.models import SalesRefDistributor


class LowQty:
    def __init__(self, user, user_type):
        if user_type == 'distributor':
            self.inventory = DistributorInventory.objects.get(distributor=user)
        elif user_type == 'salesref':
            distributor = SalesRefDistributor.objects.get(
                sales_ref=user).distributor.id
            self.inventory = DistributorInventory.objects.get(
                distributor=distributor)

    def getQty(self):
        low_qty_items = DistributorInventoryItems.objects.filter(
            qty__lt=25, inventory=self.inventory)
        items = [{'item_code': i.item_code, 'id': i.id, 'qty': i.qty}
                 for i in low_qty_items]
        return items
