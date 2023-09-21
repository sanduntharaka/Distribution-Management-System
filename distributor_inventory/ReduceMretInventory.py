from distributor_inventory.models import ItemStock
from salesref_return.models import SalesRefReturnItem


class ReduceMRetQuantity:
    """
    use to reduce qty of the main inventory items.

    reduce_qty = ReduceQuantity(item, qty)
    reduce_qty.reduce_qty()

    item->item object
    qty-> reduce qty
    """

    def __init__(self, item, id, wholesale, price) -> None:
        self.item = item
        self.id = id
        self.wholesale = wholesale
        self.price = price

    def reduce_qty(self):
        """
        this method is used to save new qty
        """
        item = self.item.id
        total_qty = self.item.qty+self.item.foc
        total_foc = self.item.foc

        stoks = ItemStock.objects.filter(
            qty__gt=0, item_id=self.id, whole_sale_price=self.wholesale, retail_price=self.price).order_by('date')

        for stok in stoks:
            stock_qty = stok.qty
            stock_foc = stok.foc

            reduce_qty = 0
            reduce_foc = 0
            from_foc = 0
            if (total_qty) <= stock_qty:

                if total_foc <= stock_foc:
                    reduce_foc = total_foc
                    reduce_qty = total_qty
                    stok.foc = stok.foc - total_foc
                    from_foc = total_foc
                    stok.qty = stok.qty - (total_qty)
                    if stok.qty < stok.foc:
                        stok.foc = stok.qty
                    total_qty = 0
                    total_foc = 0

                else:

                    reduce_foc = stok.foc
                    reduce_qty = total_qty
                    total_foc = total_foc - stok.foc
                    from_foc = stok.foc
                    stok.qty = stok.qty - (total_qty)
                    if stok.qty == 0:
                        total_foc = 0
                    total_qty = total_foc

                    stok.foc = 0

            else:

                reduce_qty = stok.qty
                reduce_foc = stok.foc
                from_foc = stok.foc
                total_qty = total_qty - (stok.qty)
                if total_foc <= stok.foc:

                    total_foc = 0
                else:
                    total_foc = total_foc - stok.foc

                stok.qty = 0
                stok.foc = 0

            stok.initial_qty = 0
            stok.save()

            # inv_item = Item(invoice_item=InvoiceIntem.objects.get(id=item), item=stok,
            #                 qty=reduce_qty, foc=reduce_foc, from_foc=from_foc)

            # inv_item.save()

            if total_foc == 0 and total_qty == 0:
                break

        # self.item.qty = self.item.qty - (self.qty+self.foc)

        # self.item.foc = 0 if self.item.foc - \
        #     (self.foc) <= 0 else self.item.foc - (self.foc)

        # self.item.save()

    def reverse_reduce_qty(self):
        self.item.qty = self.item.qty + (self.qty+self.foc)
        self.item.foc = self.item.foc + (self.foc)

        self.item.save()

    def edited_details(self, prev_qty, prev_foc):
        print('prev qty:', prev_qty)
        print('prev foc:', prev_foc)
        print('now qty:', self.qty)
        print('now foc:', self.foc)

        # reduce bill item qty
        self.item.qty = self.item.qty + \
            ((prev_qty+prev_foc)-(self.qty+self.foc))
        self.item.foc = self.item.foc + (prev_foc-self.foc)

        self.item.save()

    def deleted_details(self):

        # reduce bill item qty
        self.item.qty = self.item.qty + (self.qty+self.foc)
        self.item.foc = self.item.foc + (self.foc)

        self.item.save()
