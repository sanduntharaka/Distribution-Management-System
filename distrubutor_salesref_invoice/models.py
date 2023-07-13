from django.db.models import Sum
from django.db import models
from distrubutor_salesref.models import SalesRefDistributor
from distributor_inventory.models import DistributorInventoryItems, ItemStock, DistributorInventory
from userdetails.models import UserDetails
from dealer_details.models import Dealer
from primary_sales_area.models import PrimarySalesArea
from django.conf import settings
User = settings.AUTH_USER_MODEL


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
    sub_total = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=10, choices=BILL_STATUS, default='pending')
    is_settiled = models.BooleanField(default=False)
    rejected_reason = models.CharField(max_length=150, blank=True, null=True)
    confirmed_date = models.DateField(blank=True, null=True)

    def get_bill_code_number_combine(self):
        return self.bill_code + str(self.bill_number)

    def change_total(self, subtotal, discount):

        self.sub_total = self.sub_total+subtotal
        self.total_discount = self.total_discount+discount
        self.total = self.total+subtotal+discount

    def get_payed(self):
        payments = PaymentDetails.objects.filter(
            bill=self.id).values('paid_amount')
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
            return self.paid_amount if self.payment_type == 'credit' or self.payment_type == 'cash-credit' or self.payment_type == 'cheque-credit' or self.payment_type == 'cash-credit-cheque' else 0
        except:
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
    date = models.DateField()
    deposited_at = models.DateField()
    status = models.CharField(
        max_length=10, choices=CHEQUE_STATUS, default='pending')
    added_by = models.ForeignKey(UserDetails, on_delete=models.DO_NOTHING)


class InvoiceIntem(models.Model):
    bill = models.ForeignKey(SalesRefInvoice, on_delete=models.CASCADE)
    item = models.ForeignKey(ItemStock,
                             on_delete=models.DO_NOTHING)
    discount = models.FloatField(default=0)
    item_code = models.CharField(max_length=50)
    description = models.TextField(null=True)
    qty = models.IntegerField(blank=False)
    foc = models.FloatField(blank=False, default=0)
    pack_size = models.IntegerField(default=0)
    price = models.FloatField(blank=False, default=0)
    extended_price = models.FloatField(blank=False, default=0)

    def get_addtional_foc(self):
        count = 0
        if self.qty > 100:
            count = self.foc - \
                int(self.qty*self.item.item.category.foc_percentage/100)
        return count

    def get_value(self):
        return self.qty+self.foc
