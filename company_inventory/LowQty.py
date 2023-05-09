from .models import CompanyInventory


class LowQty:
    def getQty():
        low_qty_items = CompanyInventory.objects.filter(qty__lt=25)
        items = [{'item_code': i.item_code, 'id': i.id, 'qty': i.qty}
                 for i in low_qty_items]
        return items
