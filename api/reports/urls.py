from django.urls import path, include

urlpatterns = [
    path('staffdetails/', include('api.reports.userreport.urls')),
    path('stockdetails/', include('api.reports.stockreport.urls')),
    path('delaerdetails/', include('api.reports.dealerreport.urls')),
    path('salesdetails/', include('api.reports.salesreport.urls')),


]
# reports/staffdetails/all/
