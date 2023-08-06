from salesref_return.models import SalesRefReturnItem
class FixMRet:
    def __init__(self) -> None:
        self.items = SalesRefReturnItem.objects.all()
    def fix(self):
        
        print('start')
        for item in self.items:
            to_fix = item
            if to_fix.item is not None:
                to_fix.inventory_item = to_fix.item.item
                to_fix.whole_sale_price = to_fix.item.whole_sale_price
                to_fix.retail_price = to_fix.item.retail_price
                to_fix.initial_qty = to_fix.qty
                to_fix.initial_foc = to_fix.foc

            to_fix.save()

        print('done...')
