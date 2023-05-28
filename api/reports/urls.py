from django.urls import path, include

urlpatterns = [
    path('staffdetails/', include('api.reports.userreport.urls')),
    path('stockdetails/', include('api.reports.stockreport.urls')),
    path('delaerdetails/', include('api.reports.dealerreport.urls')),
    path('salesdetails/', include('api.reports.salesreport.urls')),
    path('mkreturns/', include('api.reports.marketreturnreport.urls')),
    path('salesreturns/', include('api.reports.salesreturnreport.urls')),
    path('pending/', include('api.reports.pendingorderreport.urls')),
    path('payments/', include('api.reports.paymentsreport.urls')),
    path('cheque/', include('api.reports.chequeinhandreport.urls')),
    path('credit/', include('api.reports.marketcreditreport.urls')),
    path('non-buying/', include('api.reports.nonbuyingreport.urls')),
]
# reports/staffdetails/all/
