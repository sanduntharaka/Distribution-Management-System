from distributor_inventory.models import ItemStock
from distrubutor_salesref_invoice.models import Item, InvoiceIntem
from django.db.models import Q


class ReduceQuantity:
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
            Q(qty__gt=0) | Q(foc__gt=0), item_id=self.id, whole_sale_price=self.wholesale, retail_price=self.price).order_by('date')

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

            inv_item = Item(invoice_item=InvoiceIntem.objects.get(id=item), item=stok,
                            qty=reduce_qty, foc=reduce_foc, from_foc=from_foc)

            inv_item.save()

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

        # inv_item.delete()

    def edited_details(self, prev_qty, prev_foc):

        # reduce bill item qty
        self.item.qty = self.item.qty + \
            ((prev_qty+prev_foc)-(self.qty+self.foc))
        self.item.foc = self.item.foc + (prev_foc-self.foc)

        self.item.save()

    def deleted_details(self):

        # reduce bill item qty
        # cal_qty = 10
        # self.item.item.qty = self.item.item.qty + \
        #     (self.qty+(self.foc-self.from_foc if self.foc > 0 else self.from_foc))
        # self.item.foc = self.item.foc + (self.foc)

        # self.item.save()

        print(self.item)
        # item_id = self.item.id
        # reduced_items = Item.objects.filter(
        #     invoice_item__item__item_id=item_id)

        # for inv_item in reduced_items:
        #     qty_to_add = inv_item.qty
        #     foc_to_add = inv_item.foc

        #     stoks = ItemStock.objects.filter(
        #         item_id=self.id,
        #         whole_sale_price=self.wholesale,
        #         retail_price=self.price
        #     ).order_by('-date')

        #     for stok in stoks:
        #         if qty_to_add > 0:
        #             qty_added = min(qty_to_add, stok.initial_qty - stok.qty)
        #             stok.qty += qty_added
        #             qty_to_add -= qty_added

        #         if foc_to_add > 0:
        #             foc_added = min(foc_to_add, stok.initial_qty - stok.foc)
        #             stok.foc += foc_added
        #             foc_to_add -= foc_added

        #         stok.save()

        #         if qty_to_add == 0 and foc_to_add == 0:
        #             break

        billed_qty = self.item.qty
        billed_foc = self.item.foc
        only_foc = self.item.from_foc

        stock = self.item.item
        print('st:', stock)
        print(f"{billed_qty} {billed_foc} {only_foc}")
        print(f"{stock.qty} {stock.foc} ")

        stock.qty = stock.qty + (billed_qty+(billed_foc-only_foc))
        stock.foc = stock.foc + (only_foc)

        print(f"{stock.qty} {stock.foc} ")

        # stock.save()
