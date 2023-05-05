class ReduceQuantity:
    """
    use to reduce qty of the main inventory items.

    reduce_qty = ReduceQuantity(item, qty)
    reduce_qty.reduce_qty()

    item->item object
    qty-> reduce qty
    """

    def __init__(self, item, qty) -> None:
        self.item = item
        self.qty = qty

    def reduce_qty(self):
        """
        this method is used to save new qty
        """
        self.item.qty = self.item.qty - self.qty
        self.item.save()
