from distributor_inventory.models import ItemStock
from distrubutor_salesref_invoice.models import Item, InvoiceIntem

class DeleteBillItems:
    def __init__(self,invoice_item) -> None:

        self.invoice_item = invoice_item
    def delete(self):
        items = Item.objects.filter(invoice_item=self.invoice_item)
        for i in items:
            qty = i.qty
            foc = i.foc
            
            i.item.qty = i.item.qty + (qty+foc)
            if i.item.foc + foc <=  i.item.initial_foc:
                i.item.foc = i.item.foc + foc

            i.delete()