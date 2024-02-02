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
        # total_qty = self.item.qty+self.item.foc
        # total_foc = self.item.foc
        bill_foc = self.item.foc
        bill_qty = self.item.qty

        stoks = ItemStock.objects.filter(
            Q(qty__gt=0) | Q(foc__gt=0), item_id=self.id, whole_sale_price=self.wholesale, retail_price=self.price).order_by('date')

        for stok in stoks:

            reduce_qty = 0
            reduce_foc = 0
            from_foc = 0

            if (bill_qty+bill_foc) <= stok.qty:

                if self.item.foc <= stok.foc:

                    stok.foc = stok.foc - bill_foc
                    stok.qty = stok.qty - bill_foc
                    reduce_foc = bill_foc
                    bill_foc = 0
                    print("sfc:", stok.foc, "sqty:", stok.qty)
                    if bill_qty <= (stok.qty-stok.foc):
                        stok.qty = stok.qty-bill_qty
                        reduce_qty = bill_qty
                        bill_qty = 0
                    else:
                        reduce_qty = stok.qty-stok.foc
                        stok.qty = stok.qty-reduce_qty
                        bill_qty = bill_qty-reduce_qty
                        stok.foc = stok.foc-bill_qty
                        reduce_foc = reduce_foc+bill_qty
                        stok.qty = stok.qty-bill_qty
                        bill_qty = 0

                else:

                    bill_foc = bill_foc - stok.foc
                    reduce_foc = stok.foc
                    stok.qty = stok.qty - (stok.foc)
                    stok.foc = 0

                    if bill_foc <= stok.qty:
                        stok.qty = stok.qty - bill_foc
                        reduce_qty = bill_foc
                        bill_foc = 0
                    stok.qty = stok.qty - bill_qty
                    reduce_qty = reduce_qty + bill_qty
                    bill_qty = 0

            else:

                reduce_qty = stok.qty - stok.foc
                reduce_foc = stok.foc

                if bill_foc <= stok.foc:
                    stok.foc = stok.foc - bill_foc
                    stok.qty = stok.qty - bill_qty
                    bill_foc = 0
                    bill_qty = bill_qty-stok.qty

                else:
                    bill_foc = bill_foc - stok.foc
                    stok.qty = stok.qty - (stok.foc)
                    bill_qty = bill_qty - stok.qty

                stok.foc = 0
                stok.qty = 0

            stok.initial_qty = 0
            stok.save()

            inv_item = Item(invoice_item=InvoiceIntem.objects.get(id=item), item=stok,
                            qty=reduce_qty, foc=reduce_foc, from_foc=from_foc)

            inv_item.save()

            if bill_foc == 0 and bill_qty == 0:
                break

        # self.item.qty = self.item.qty - (self.qty+self.foc)

        # self.item.foc = 0 if self.item.foc - \
        #     (self.foc) <= 0 else self.item.foc - (self.foc)

        # self.item.save()

    def reverse_reduce_qty(self):

        self.item.item.qty = self.item.item.qty + (self.item.qty+self.item.foc)
        self.item.item.foc = self.item.item.foc + (self.item.foc)

        self.item.item.save()

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
