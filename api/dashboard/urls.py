from django.urls import path
from .import views
urlpatterns = [
    path('usercount/', views.currentUserCount),
    path('today/sales/invoices/company/',
         views.today_total_sales_invoices_as_company),
    path('today/inventory/notzero/company/',
         views.today_company_inventory_status),
    path('today/market-return/company/',
         views.today_market_return),
    path('get/allsales/company/months',
         views.allSalesinvoicedataBymonth),
    path('get/lowqty/company/',
         views.allLawQtyCompany),
]
