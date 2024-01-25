import datetime
from dealer_details.models import Dealer
from datetime import datetime
from sales_route.models import SalesRoute, DailyStatus
from distrubutor_salesref.models import SalesRefDistributor
from sales_return.TotalSalesReturn import TotalSalesReturn
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
# from company_inventory.CountCompanyInventory import CountCompanyInventory
from salesref_return.TotalMarketReturn import TotalMarketReturn
from distrubutor_salesref_invoice.SalesData import SalesData
from distributor_inventory.LowQty import LowQty


@api_view(['GET'])
def currentUserCount(request):
    ago20m = timezone.now() - timezone.timedelta(minutes=20)
    count = UserAccount.objects.filter(last_login__gte=ago20m).count()
    return Response(count, status.HTTP_200_OK)


@api_view(['POST'])
def today_as_company(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='company')
    total_count_month, total_sales_month, total_balance_month = total.getThisMonth()
    total_count_year, total_sales_year, total_balance_year = total.getThisYear()
    total_count_days, total_sales_days = total.getYesterDay()
    data = {
        'sales': {
            'count': total.getCount(),
            'total': total.totalSale(),
            'discount': total.totalDiscont(),
            'status': total.getPrevDayStatus()
        },
        'yester_day': {
            'count': total_count_days,
            'total_sales': total_sales_days,
        },
        'this_month': {
            'count': total_count_month,
            'total_sales': total_sales_month,
            'total_balance': total_balance_month
        },
        'this_year': {
            'count': total_count_year,
            'total_sales': total_sales_year,
            'total_balance': total_balance_year
        }


    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def today_as_distributor(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='distributor')
    mreturn_total = TotalMarketReturn(
        date=request.data['date'], user=item, user_type='distributor')
    sreturn_total = TotalSalesReturn(
        date=request.data['date'], user=item, user_type='distributor')
    total_count_days, total_sales_days = total.getYesterDay()
    total_count_month, total_sales_month, total_balance_month = total.getThisMonth()
    total_count_year, total_sales_year, total_balance_year = total.getThisYear()
    tota_p_inv, pending_count, pending_obove = total.getPendingInvoices()
    tota_c_inv, credit_count, credit_obove = total.getCreditInvoices()
    print('tot:', total_count_days, '\n totsales:', total_sales_days)
    data = {
        'sales': {
            'count': total.getCount(),
            'total': total.totalSale(),
            'discount': total.totalDiscont(),
            'status': total.getPrevDayStatus()
        },
        'market_returns': mreturn_total.getCount(),
        'sales_returns': sreturn_total.getCount(),
        'yester_day': {
            'count': total_count_days,
            'total_sales': total_sales_days,
        },
        'this_month': {
            'count': total_count_month,
            'total_sales': total_sales_month,
            'total_balance': total_balance_month
        },
        'this_year': {
            'count': total_count_year,
            'total_sales': total_sales_year,
            'total_balance': total_balance_year
        },
        'pending_inv': {
            'total': tota_p_inv,
            'count': pending_count,
            'above': pending_obove
        },
        'credit_inv': {
            'total': tota_c_inv,
            'count': credit_count,
            'above': credit_obove
        }


    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def today_as_saleref(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='salesref')
    mreturn_total = TotalMarketReturn(
        date=request.data['date'], user=item, user_type='salesref')
    sreturn_total = TotalSalesReturn(
        date=request.data['date'], user=item, user_type='salesref')
    total_count_month, total_sales_month, total_balance_month = total.getThisMonth()
    total_count_year, total_sales_year, total_balance_year = total.getThisYear()
    total_count_days, total_sales_days = total.getYesterDay()
    tota_p_inv, pending_count, pending_obove = total.getPendingInvoices()
    tota_c_inv, credit_count, credit_obove = total.getCreditInvoices()
    data = {
        'sales': {
            'count': total.getCount(),
            'total': total.totalSale(),
            'discount': total.totalDiscont(),
            'status': total.getPrevDayStatus()
        },
        'market_returns': mreturn_total.getCount(),
        'sales_returns': sreturn_total.getCount(),
        'yester_day': {
            'count': total_count_days,
            'total_sales': total_sales_days,
        },
        'this_month': {
            'count': total_count_month,
            'total_sales': total_sales_month,
            'total_balance': total_balance_month
        },
        'this_year': {
            'count': total_count_year,
            'total_sales': total_sales_year,
            'total_balance': total_balance_year
        },
        'pending_inv': {
            'total': tota_p_inv,
            'count': pending_count,
            'above': pending_obove
        },
        'credit_inv': {
            'total': tota_c_inv,
            'count': credit_count,
            'above': credit_obove
        }


    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def today_as_manager(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='manager')
    total_count_month, total_sales_month, total_balance_month = total.getThisMonth()
    total_count_year, total_sales_year, total_balance_year = total.getThisYear()
    total_count_days, total_sales_days = total.getYesterDay()
    data = {
        'sales': {
            'count': total.getCount(),
            'total': total.totalSale(),
            'discount': total.totalDiscont(),
            'status': total.getPrevDayStatus()
        },
        'yester_day': {
            'count': total_count_days,
            'total_sales': total_sales_days,
        },
        'this_month': {
            'count': total_count_month,
            'total_sales': total_sales_month,
            'total_balance': total_balance_month
        },
        'this_year': {
            'count': total_count_year,
            'total_sales': total_sales_year,
            'total_balance': total_balance_year
        }


    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def today_as_executive(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='executive')
    total_count_month, total_sales_month, total_balance_month = total.getThisMonth()
    total_count_year, total_sales_year, total_balance_year = total.getThisYear()
    total_count_days, total_sales_days = total.getYesterDay()
    data = {
        'sales': {
            'count': total.getCount(),
            'total': total.totalSale(),
            'discount': total.totalDiscont(),
            'status': total.getPrevDayStatus()
        },
        'yester_day': {
            'count': total_count_days,
            'total_sales': total_sales_days,
        },
        'this_month': {
            'count': total_count_month,
            'total_sales': total_sales_month,
            'total_balance': total_balance_month
        },
        'this_year': {
            'count': total_count_year,
            'total_sales': total_sales_year,
            'total_balance': total_balance_year
        }


    }
    return Response(data, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def today_company_inventory_status(request):
#     total = CountCompanyInventory(date=request.data['date'])
#     return Response(data={'count': total.getCountWthoutZero()}, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def today_market_return(request):
#     total = TotalMarketReturn(date=request.data['date'])
#     deduct_count, deduct_total = total.getCountDeductBill()
#     data = {
#         'count_return_good': total.getCountReturnGoods(),
#         'count_return_good_items': total.totalReturnGoodsItems(),
#         'count_deduct_good': deduct_count,
#         'total_deduct_good': deduct_total,
#         'count_deduct_good_items': total.totalDeductBillItems(),

#     }
#     return Response(data=data, status=status.HTTP_200_OK)


@api_view(['GET'])
def allSalesinvoicedataBymonth(request):
    inv = SalesData('company', id=None)

    return Response(data=inv.getData(), status=status.HTTP_200_OK)


@api_view(['GET'])
def allSalesinvoicedataManagerBymonth(request, *args, **kwargs):
    item = kwargs.get('id')
    inv = SalesData('manager', item)
    return Response(data=inv.getData(), status=status.HTTP_200_OK)


@api_view(['GET'])
def allSalesinvoicedataExecutiveBymonth(request, *args, **kwargs):
    item = kwargs.get('id')
    inv = SalesData('executive', item)
    return Response(data=inv.getData(), status=status.HTTP_200_OK)


@api_view(['GET'])
def allSalesinvoicedataDistributorBymonth(request, *args, **kwargs):
    item = kwargs.get('id')
    inv = SalesData('distributor', item)
    return Response(data=inv.getData(), status=status.HTTP_200_OK)


@api_view(['GET'])
def allSalesinvoicedataSalesRefBymonth(request, *args, **kwargs):
    item = kwargs.get('id')
    inv = SalesData('salesref', item)
    return Response(data=inv.getData(), status=status.HTTP_200_OK)


@api_view(['POST'])
def allDistributorSalesByManager(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='manager')
    distributors, codes = total.getAllDistributorsSales()
    data = {
        'distributors': distributors,
        'color': codes
    }
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['POST'])
def allDistributorSalesByExecutive(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='executive')
    distributors, codes = total.getAllDistributorsSales()
    data = {
        'distributors': distributors,
        'color': codes
    }
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['POST'])
def allDistributorSalesByCompany(request, *args, **kwargs):
    item = kwargs.get('id')
    total = CountSalesInvoiceAll(
        date=request.data['date'], user_details=item, user_type='company')
    distributors, codes = total.getAllManagersSales()
    data = {
        'distributors': distributors,
        'color': codes
    }
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['GET'])
def allLawQtyByDistributor(request, *args, **kwargs):
    item = kwargs.get('id')
    low_qty_class = LowQty(user=item, user_type='distributor')
    return Response(data=low_qty_class.getQty(), status=status.HTTP_200_OK)


@api_view(['GET'])
def allLawQtyBySalesref(request, *args, **kwargs):
    item = kwargs.get('id')
    low_qty_class = LowQty(user=item, user_type='salesref')
    return Response(data=low_qty_class.getQty(), status=status.HTTP_200_OK)

# date eka ain kranna payement karana
# participate wena ayage recode ekak thiyaganna
# qr scan krana eka regisration number eka
# regsitration number ekak wenama hadenna one
# google login

# const data = [
#   { name: 'Group A', value: 400 },
#   { name: 'Group B', value: 300 },
#   { name: 'Group C', value: 300 },
#   { name: 'Group D', value: 200 },
# ];


current_day = datetime.today()


@api_view(['GET'])
def getNextToVisteDealer(request, *args, **kwargs):
    # Use "%A" format code for full weekday name
    date = current_day.date()
    try:
        sales_route = SalesRoute.objects.get(
            salesref__user=request.user, date=date, is_approved=True)
    except Exception as e:
        return Response(data={'dealer': 'Routes Not Assigned'}, status=status.HTTP_200_OK)
    try:
        today = DailyStatus.objects.get(
            route=sales_route, date=current_day)
        visited = [d["id"] for d in today.coverd]
        for item in sales_route.dealers:
            if item not in visited:
                dealer = Dealer.objects.get(id=item)
                break

    except:
        dealer = Dealer.objects.get(id=sales_route.dealers[0])
    return Response(data={'dealer': dealer.name}, status=status.HTTP_200_OK)
