from distributor_inventory.models import DistributorInventoryItems, ItemStock
from inventory_history.models import DistributorHistoryItem
from datetime import datetime

today = datetime.today()


def autoCreateInventoryHistory():
    items = ItemStock.objects.filter(qty__gt=0)
    date = today.date()

    for item in items:

        history = DistributorHistoryItem(
            item=item, qty=item.qty, foc=item.foc)
        history.save()

    f = open("./logs/inventory_history/logs.txt", "a")
    f.write(f"{date} added total {len(items)}\n")
    f.close()
