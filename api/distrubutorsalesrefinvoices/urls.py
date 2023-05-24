from django.urls import path
from . import views

urlpatterns = [
    path('create/invoice/', views.CreateInvoice.as_view()),
    path('create/invoice/cheque/', views.AddChequeDetails.as_view()),
    path('create/invoice/confirm/<int:pk>', views.ConfirmInvoice.as_view()),
    path('create/invoice/cheque/confirm/<int:pk>',
         views.ConfirmCheque.as_view()),
    path('get/invoice/cheque/<id>', views.GetChequeDetails.as_view()),
    path('all/invoice/', views.AllInvoice.as_view()),
    path('all/invoice/by/salesref/<id>', views.AllInvoiceBySalesRef.as_view()),
    path('all/invoice/by/distributor/<id>',
         views.AllInvoiceByDistributor.as_view()),
    path('items/<id>', views.InvoiceItems.as_view()),
    path('create/invoice/items/', views.CreateInvoiceItems.as_view()),
]
