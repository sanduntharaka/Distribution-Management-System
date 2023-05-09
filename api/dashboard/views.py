from rest_framework import status
from rest_framework.response import Response
from . import serializers
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics
from django.shortcuts import get_list_or_404
from django.utils import timezone
from users.models import UserAccount
from distrubutor_salesref_invoice.CountSalesInvoice import CountSalesInvoiceAll
from distrubutor_salesref_invoice.models import SalesRefInvoice
from company_inventory.CountCompanyInventory import CountCompanyInventory
from salesref_return.TotalMarketReturn import TotalMarketReturn
from distrubutor_salesref_invoice.SalesData import SalesData
from company_inventory.LowQty import LowQty


@api_view(['GET'])
def currentUserCount(request):
    ago20m = timezone.now() - timezone.timedelta(minutes=20)
    count = UserAccount.objects.filter(last_login__gte=ago20m).count()
    return Response(count, status.HTTP_200_OK)


@api_view(['POST'])
def today_total_sales_invoices_as_company(request):
    total = CountSalesInvoiceAll(date=request.data['date'])
    return Response(data={'count': total.getCount(), 'total': total.totalSale(), 'discount': total.totalDiscont(), 'status': total.getPrevDayStatus()}, status=status.HTTP_200_OK)


@api_view(['POST'])
def today_company_inventory_status(request):
    total = CountCompanyInventory(date=request.data['date'])
    return Response(data={'count': total.getCountWthoutZero()}, status=status.HTTP_200_OK)


@api_view(['POST'])
def today_market_return(request):
    total = TotalMarketReturn(date=request.data['date'])
    deduct_count, deduct_total = total.getCountDeductBill()
    data = {
        'count_return_good': total.getCountReturnGoods(),
        'count_return_good_items': total.totalReturnGoodsItems(),
        'count_deduct_good': deduct_count,
        'total_deduct_good': deduct_total,
        'count_deduct_good_items': total.totalDeductBillItems(),

    }
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['GET'])
def allSalesinvoicedataBymonth(request):
    inv = SalesData()

    return Response(data=inv.getData(), status=status.HTTP_200_OK)


@api_view(['GET'])
def allLawQtyCompany(request):
    return Response(data=LowQty.getQty(), status=status.HTTP_200_OK)
