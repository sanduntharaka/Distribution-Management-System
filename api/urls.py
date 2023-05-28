from django.urls import path, include
urlpatterns = [

    path('dashboard/', include('api.dashboard.urls')),
    path('users/', include('api.userdetailsapp.urls')),
    path('company/inventory/', include('api.companyInventory.urls')),
    path('company/invoice/', include('api.companyInvoices.urls')),
    path('manager/distributor/', include('api.managerdistributors.urls')),
    path('distributor/', include('api.distributor.urls')),
    path('distributor/invoice/', include('api.distributor_invoices.urls')),
    # path('salesref/', include('api.salesrefs.urls')),
    path('distributor/salesref/', include('api.distrubutorsalesrefs.urls')),
    path('salesref/invoice/', include('api.distrubutorsalesrefinvoices.urls')),
    path('salesref/return/', include('api.return_salesref.urls')),
    path('salesreturn/return/', include('api.salesreturn.urls')),


    path('dealer-category/', include('api.dealercategory.urls')),
    path('dealer/', include('api.dealers.urls')),
    path('psa/', include('api.psa_api.urls')),
    path('not-buy/', include('api.notbuydetails.urls')),
    path('leave/', include('api.salesrefleave.urls')),
    path('category/', include('api.itemcategory.urls')),
    path('reports/', include('api.reports.urls')),

]
