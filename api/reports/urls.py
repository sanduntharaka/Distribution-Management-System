from django.urls import path, include

urlpatterns = [
    path('staffdetails/', include('api.reports.userreport.urls')),
    path('stockdetails/', include('api.reports.stockreport.urls')),
    path('delaerdetails/', include('api.reports.dealerreport.urls')),
    path('psadetails/', include('api.reports.psareport.urls')),
    path('salesdetails/', include('api.reports.salesreport.urls')),
    path('deleverydetails/', include('api.reports.delevaryreport.urls')),
    path('mkreturns/', include('api.reports.marketreturnreport.urls')),
    path('salesreturns/', include('api.reports.salesreturnreport.urls')),
    path('pending/', include('api.reports.pendingorderreport.urls')),
    path('payments/', include('api.reports.paymentsreport.urls')),
    path('cheque/', include('api.reports.chequeinhandreport.urls')),
    path('collectionsheet/', include('api.reports.collectionsheet.urls')),
    path('credit/', include('api.reports.marketcreditreport.urls')),
    path('oldcredit/', include('api.reports.oldcreditbillsreport.urls')),

    path('outstanding/', include('api.reports.totaloutstanding.urls')),
    path('focreport/', include('api.reports.focreport.urls')),
    path('addtionalfocreport/', include('api.reports.additionalfoc.urls')),
    path('invent-status/', include('api.reports.inventorystatus.urls')),



    path('credit-collection/', include('api.reports.creditbillscollectionreport.urls')),
    path('non-buying/', include('api.reports.nonbuyingreport.urls')),
    path('delevered-sales/', include('api.reports.deleveredsalesreport.urls')),
    path('foc-normal/', include('api.reports.normalfocreport.urls')),
    path('dealer-pattern/', include('api.reports.dealerpattern.urls')),
    path('daily-report/', include('api.reports.dailyreport.urls')),

]

# reports/staffdetails/all/
