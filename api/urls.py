from django.urls import path, include
urlpatterns = [
    path('users/', include('api.userdetailsapp.urls')),
    path('company/inventory/', include('api.companyInventory.urls')),
    path('company/invoice/', include('api.companyInvoices.urls')),
    path('distributor/', include('api.distributor.urls')),
    path('distributor/invoice/', include('api.distributor_invoices.urls')),
    # path('salesref/', include('api.salesrefs.urls')),
    path('distributor/salesref/', include('api.distrubutorsalesrefs.urls')),
    path('salesref/invoice/', include('api.distrubutorsalesrefinvoices.urls')),
    path('salesref/return/', include('api.return_salesref.urls')),
    path('dealer/', include('api.dealers.urls')),
    path('psa/', include('api.psa_api.urls')),
    path('not-buy/', include('api.notbuydetails.urls')),
]
