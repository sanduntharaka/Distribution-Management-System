from distributor_inventory.models import DistributorInventoryItems, ItemStock
from inventory_history.models import DistributorHistoryItem


def autoCreateInventoryHistory():
    items = ItemStock.objects.filter(qty__gt=0)
    for item in items:

        history = DistributorHistoryItem(
            item=item, qty=item.qty, foc=item.foc)
        history.save()
