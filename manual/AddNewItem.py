from distrubutor_salesref_invoice.models import InvoiceIntem,Item
class AddNewItem:
    def __init__(self) -> None:
        self.main_items = InvoiceIntem.objects.all()
       

    def run(self):
        print("Im Starting")
        for main_item in self.main_items:
            create_new = Item(invoice_item=main_item,item=main_item.item,qty=main_item.qty,foc = main_item.foc)
            create_new.save()
        print("Done.")