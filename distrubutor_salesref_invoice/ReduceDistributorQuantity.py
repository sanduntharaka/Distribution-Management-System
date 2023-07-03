class ReduceQuantity:
    """
    use to reduce qty of the main inventory items.

    reduce_qty = ReduceQuantity(item, qty)
    reduce_qty.reduce_qty()

    item->item object
    qty-> reduce qty
    """

    def __init__(self, item, qty, foc) -> None:
        self.item = item
        self.qty = int(qty)
        self.foc = int(foc)

    def reduce_qty(self):
        """
        this method is used to save new qty
        """
        self.item.qty = self.item.qty - (self.qty+self.foc)

        self.item.foc = 0 if self.item.foc - \
            (self.foc) <= 0 else self.item.foc - (self.foc)

        self.item.save()

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
