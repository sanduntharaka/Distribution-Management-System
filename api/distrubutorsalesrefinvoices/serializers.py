from rest_framework import serializers
from distrubutor_salesref_invoice.models import SalesRefInvoice, InvoiceIntem, ChequeDetails, PaymentDetails


class CreateInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'dis_sales_ref', 'date', 'bill_code', 'bill_number',
                  'dealer', 'total', 'total_discount',  'added_by', 'billing_price_method', 'sub_total')


class CreateInvoicePaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetails
        fields = ('__all__')


class CreateInvoiceItemsSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceIntem
        fields = ('__all__')


class GetInvoiceItemsSerializer(serializers.ModelSerializer):
    wholesale_price = serializers.CharField(source='item.whole_sale_price')
    retail_price = serializers.CharField(source='item.retail_price')
    bill_code = serializers.CharField(
        source='bill.get_bill_code_number_combine')

    class Meta:
        model = InvoiceIntem
        fields = ('id', 'bill', 'item', 'discount', 'item_code', 'description', 'qty',
                  'foc', 'pack_size', 'price', 'extended_price', 'wholesale_price', 'retail_price', 'bill_code')


class GetInvoicesSerializer(serializers.ModelSerializer):
    code = serializers.CharField(
        source='get_bill_code_number_combine')
    distributor = serializers.CharField(
        source='dis_sales_ref.distributor.full_name')
    added_by = serializers.CharField(
        source='added_by.full_name')
    dealer_name = serializers.CharField(source='dealer.name')
    dealer_address = serializers.CharField(source='dealer.address')
    contact_number = serializers.CharField(source='dealer.contact_number')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'dis_sales_ref', 'date', 'bill_code', 'bill_number',
                  'dealer', 'total', 'total_discount', 'dealer_address', 'contact_number', 'status', 'added_by', 'code', 'distributor', 'dealer_name', 'billing_price_method', 'sub_total', 'is_settiled')


class GetInvoiceWithPaymentSerializer(serializers.ModelSerializer):
    code = serializers.CharField(
        source='get_bill_code_number_combine')
    distributor = serializers.CharField(
        source='dis_sales_ref.distributor.full_name')
    added_by = serializers.CharField(
        source='added_by.full_name')
    dealer_name = serializers.CharField(source='dealer.name')
    dealer_address = serializers.CharField(source='dealer.address')
    contact_number = serializers.CharField(source='dealer.contact_number')
    payed = serializers.CharField(
        source='get_payed')
    due_date = serializers.CharField(
        source='get_due_date')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'dis_sales_ref', 'date', 'bill_code', 'bill_number',
                  'dealer', 'total', 'total_discount', 'dealer_address', 'contact_number', 'due_date', 'status', 'added_by', 'code', 'distributor', 'dealer_name', 'billing_price_method', 'sub_total', 'is_settiled', 'payed')


class AddChequeDetailsSerialzer(serializers.ModelSerializer):
    class Meta:
        model = ChequeDetails
        fields = ('__all__')


class ChangeStatusInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefInvoice
        fields = ('status', 'paid_amount', 'confirmed_date')


class ChangeStatusChequeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChequeDetails
        fields = ('deposited_at', 'status',)


class GetDealerInvoiceSerializer(serializers.ModelSerializer):
    code = serializers.CharField(
        source='get_bill_code_number_combine')

    class Meta:
        model = SalesRefInvoice
        fields = ('id', 'code')
