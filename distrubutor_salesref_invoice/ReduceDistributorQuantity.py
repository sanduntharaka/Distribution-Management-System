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
        self.item.save()

    def reverse_reduce_qty(self):
        self.item.qty = self.item.qty + (self.qty+self.foc)
        self.item.save()
