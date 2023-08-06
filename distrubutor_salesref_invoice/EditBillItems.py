from distributor_inventory.models import ItemStock
from distrubutor_salesref_invoice.models import Item, InvoiceIntem

class EditBillItems:
    def __init__(self,item_code,wholesale,price,to_remove_qty,to_remove_foc,inv_item) -> None:
        """
        parse related DistributorInventoryItems id as id,
        parse related ItemStock wholesale and retail_price as wholesale,price ,

        """
        self.item_code = item_code
        self.wholesale=wholesale
        self.price=price
        self.to_remove_qty=to_remove_qty
        self.to_remove_foc=to_remove_foc
        self.inv_item=inv_item


    def reduce_qty(self):
        """
        this method is used to save new qty
        """
        total_qty = self.to_remove_qty+self.to_remove_foc
        print(total_qty)
        total_foc = self.to_remove_foc

        stoks = ItemStock.objects.filter(
            qty__gt=0, item__item_code=self.item_code, whole_sale_price=self.wholesale, retail_price=self.price).order_by('date')

        for stok in stoks:
            stock_qty = stok.qty
            stock_foc = stok.foc

            reduce_qty = 0
            reduce_foc = 0

            if (total_qty) <= stock_qty:

                if total_foc <= stock_foc:
                    reduce_foc = total_foc
                    reduce_qty = total_qty
                    stok.foc = stok.foc - total_foc
                    stok.qty = stok.qty - (total_qty)
                    if stok.qty < stok.foc:
                        stok.foc = stok.qty
                    total_qty = 0
                    total_foc = 0

                else:
                    reduce_foc = stok.foc
                    reduce_qty = total_qty
                    total_foc = total_foc - stok.foc
                    stok.qty = stok.qty - (total_qty)
                    if stok.foc == 0:
                        total_foc = 0
                    total_qty = total_foc

                    stok.foc = 0

            else:

                reduce_qty = stok.qty
                reduce_foc = stok.foc
                total_qty = total_qty - (stok.qty)
                if total_foc <= stok.foc:

                    total_foc = 0
                else:
                    total_foc = total_foc - stok.foc

                stok.qty = 0
                stok.foc = 0

            stok.initial_qty = 0
            stok.save()

            inv_item = Item(invoice_item=self.inv_item, item=stok,
                            qty=reduce_qty, foc=reduce_foc)

            inv_item.save()

            if total_qty == 0:
                break

