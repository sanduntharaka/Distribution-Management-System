from django.utils import timezone
from django.db.models import Q
from django.db.models import Sum
from django.db import models
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventoryItems, ItemStock, DistributorInventory
from userdetails.models import UserDetails
from dealer_details.models import Dealer
from primary_sales_area.models import PrimarySalesArea
from django.conf import settings
User = settings.AUTH_USER_MODEL


# Get the current date
current_date = timezone.now().date()


class SalesRefInvoice(models.Model):
    BILL_STATUS = (
        ('confirmed', 'confirmed'),
        ('rejected', 'rejected'),
        ('pending', 'pending'),
    )
    dis_sales_ref = models.ForeignKey(
        SalesRefDistributor, on_delete=models.CASCADE)
    inventory = models.ForeignKey(
        DistributorInventory, on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateField()
    bill_code = models.CharField(max_length=10, default='INV-')
    bill_number = models.IntegerField()
    dealer = models.ForeignKey(Dealer, on_delete=models.CASCADE)
    total = models.FloatField()
    total_discount = models.FloatField()
    time = models.TimeField(null=True, blank=True)
    added_by = models.ForeignKey(UserDetails, on_delete=models.DO_NOTHING)
    billing_price_method = models.CharField(default='2', max_length=2)
    invoice_type = models.CharField(default='normal', max_length=10)
    sub_total = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=10, choices=BILL_STATUS, default='pending')
    is_settiled = models.BooleanField(default=False)
    rejected_reason = models.CharField(max_length=150, blank=True, null=True)
    confirmed_date = models.DateField(blank=True, null=True)
    vat_amount = models.FloatField(default=0.0)

    def get_bill_code_number_combine(self):
        return f"{self.bill_code}-{str(self.bill_number)}"

    def change_total(self, subtotal, discount):

        self.sub_total = self.sub_total+subtotal
        self.total_discount = self.total_discount+discount
        self.total = self.total+subtotal+discount

    def get_payed(self):
        payments = PaymentDetails.objects.filter(
            bill=self.id, is_completed=True).values('paid_amount')
        amount = [pay['paid_amount'] for pay in payments]

        return sum(amount)

    def get_qty(self):
        try:
            return InvoiceIntem.objects.filter(bill=self.id).aggregate(total_qty=Sum('qty'))['total_qty']
        except:
            return 0

    def get_foc(self):
        try:
            return sum(list(InvoiceIntem.objects.filter(bill=self.id).values_list('foc', flat=True)))
        except:
            return 0

    def get_balance(self):
        try:
            amount = PaymentDetails.objects.filter(bill=self.id).aggregate(
                total_amount=Sum('paid_amount'))
            return self.total - amount['total_amount']
        except:
            return 0

    def get_due_date(self):
        try:
            return PaymentDetails.objects.filter(bill=self.id).last().due_date
        except:
            return ' '

    def is_cheques(self):
        return bool(PaymentDetails.objects.filter(bill=self.id, payment_type__in=['cash-cheque', 'cheque-credit', 'cash-credit-cheque']))

    def is_overdue(self):
        return bool(PaymentDetails.objects.filter(bill=self.id, payment_type__in=['credit', 'cash-credit', 'cash-cheque', 'cheque-credit', 'cash-credit-cheque'], due_date__lt=current_date))

    def get_bill_items_with_categories(self):
        items = Item.objects.filter(invoice_item__bill=self.id)
        return_data = []
        category_list = [item.item.item.category.id for item in items]
        unique_set = set(category_list)
        unique_list = list(unique_set)
        for category in unique_list:
            item_by_category = Item.objects.filter(
                invoice_item__bill=self.id, item__item__category=category)

            data = {

                'category': item_by_category.first().item.item.category.category_name,
                'total': sum([i.invoice_item.extended_price for i in item_by_category])
            }
            return_data.append(data)
        return return_data

    def total_cash(self):
        payments = PaymentDetails.objects.filter(bill=self.id)

        total = 0
        for pay in payments:
            try:
                cheque = ChequeDetails.objects.get(payment_details=pay.id)
                cash = pay.paid_amount-cheque.amount
                total += cash
            except:
                total += pay.paid_amount
        return total

    def total_credit(self):
        payments = PaymentDetails.objects.filter(bill=self.id)
        total = self.total - sum([pay.paid_amount for pay in payments])

        return abs(total)

    def total_cheques(self):
        payments = ChequeDetails.objects.filter(payment_details__bill=self.id)

        total = sum([pay.amount for pay in payments])

        return total


class PaymentDetails(models.Model):
    PAYMENT_TYPE = (
        ('cash', 'cash'),
        ('credit', 'credit'),
        ('cheque', 'cheque'),
        ('cash-credit', 'cash-credit'),
        ('cash-cheque', 'cash-cheque'),
        ('cheque-credit', 'cheque-credit'),
        ('cash-credit-cheque', 'cash-credit-cheque'),

    )
    bill = models.ForeignKey(SalesRefInvoice, on_delete=models.CASCADE)
    payment_type = models.CharField(
        max_length=25, default='cash', choices=PAYMENT_TYPE)
    paid_amount = models.FloatField(default='0.0')
    date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    added_by = models.ForeignKey(UserDetails, on_delete=models.DO_NOTHING)
    is_completed = models.BooleanField(default=True)

    def get_cheque_id(self):
        try:
            return ChequeDetails.objects.get(payment_details=self.id).id
        except:
            return None

    def get_cheque_status(self):
        try:
            return ChequeDetails.objects.get(payment_details=self.id).status
        except:
            return ' '

    def get_cheque_number(self):
        try:
            return ChequeDetails.objects.get(payment_details=self.id).cheque_number
        except:
            return ' '

    def get_cheque_date(self):
        try:
            return ChequeDetails.objects.get(payment_details=self.id).cheque_number
        except:
            return ' '

    def get_cheque_bank(self):
        try:
            return ChequeDetails.objects.get(payment_details=self.id).cheque_number
        except:
            return ' '

    def get_cheque_amount(self):
        try:
            return ChequeDetails.objects.get(payment_details=self.id).amount
        except:
            return 0

    def get_cash(self):
        try:
            return self.paid_amount if self.payment_type == 'cash' else 0
        except:
            return 0

    def get_credit(self):
        try:
            total_payed_details = PaymentDetails.objects.filter(Q(date=self.date) | Q(date__lt=self.date),
                                                                bill=self.bill).values('paid_amount')
            payed = [i['paid_amount'] for i in total_payed_details]

            return self.bill.total - (sum(list(payed)))
        except Exception as e:
            print(e)
            return 0

    def get_cheque(self):
        try:
            return self.paid_amount if self.payment_type == 'cheque' else 0
        except:
            return 0


class ChequeDetails(models.Model):
    CHEQUE_STATUS = (
        ('cleared', 'cleared'),
        ('pending', 'pending'),
        ('return', 'return'),
    )
    payment_details = models.OneToOneField(
        PaymentDetails, on_delete=models.CASCADE)
    number_of_dates = models.IntegerField()
    cheque_number = models.CharField(max_length=50)
    branch = models.CharField(max_length=50)
    payee_name = models.CharField(max_length=150)
    bank = models.CharField(max_length=150)
    amount = models.FloatField()

    date = models.DateField()  # cheque date
    deposited_at = models.DateField()
    status = models.CharField(
        max_length=10, choices=CHEQUE_STATUS, default='pending')
    added_by = models.ForeignKey(UserDetails, on_delete=models.DO_NOTHING)


class InvoiceIntem(models.Model):
    bill = models.ForeignKey(SalesRefInvoice, on_delete=models.CASCADE)
    item = models.ForeignKey(ItemStock,
                             on_delete=models.DO_NOTHING, related_name='to_remove_item', null=True, blank=True)
    discount = models.FloatField(default=0)
    item_code = models.CharField(max_length=50)
    description = models.TextField(null=True)
    qty = models.IntegerField(blank=False)
    foc = models.FloatField(blank=False, default=0)
    pack_size = models.IntegerField(default=0)
    price = models.FloatField(blank=False, default=0)
    whole_sale_price = models.FloatField(blank=False, default=0)
    extended_price = models.FloatField(blank=False, default=0)

    def get_addtional_foc(self):
        count = 0
        if self.qty > 100:
            count = self.foc - \
                int(self.qty*self.item.item.category.foc_percentage/100)
        return count

    def get_value(self):
        return self.qty+self.foc

    def item_category(self):

        category = Item.objects.filter(invoice_item=self.id).first()
        if category is not None:
            return category.item.item.category.short_code


class Item(models.Model):
    invoice_item = models.ForeignKey(InvoiceIntem,
                                     on_delete=models.CASCADE, null=True, blank=True, related_name='related_main_item')
    item = models.ForeignKey(ItemStock,
                             on_delete=models.DO_NOTHING, related_name='related_item')
    qty = models.IntegerField(default=0)
    foc = models.IntegerField(default=0)
    from_foc = models.IntegerField(default=0)
