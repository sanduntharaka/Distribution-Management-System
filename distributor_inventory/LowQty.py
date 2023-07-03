from .models import DistributorInventory, DistributorInventoryItems, ItemStock
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
        low_qty_items = ItemStock.objects.filter(
            qty__lt=25, qty__gt=0, item__inventory=self.inventory)
        items = [{'item_code': i.item.item_code, 'id': i.id, 'qty': i.qty}
                 for i in low_qty_items]
        return items
