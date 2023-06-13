from django.urls import path
from . import views

urlpatterns = [
    path('create/invoice/', views.CreateInvoice.as_view()),
    path('create/invoice/payment/', views.CreateInvoicePayment.as_view()),
    path('create/invoice/cheque/', views.AddChequeDetails.as_view()),
    path('create/invoice/confirm/<int:pk>', views.ConfirmInvoice.as_view()),
    path('create/invoice/credit/<int:pk>',
         views.AddCredit.as_view()),
    path('get/invoice/cheque/<id>', views.GetChequeDetails.as_view()),
    path('all/invoice/', views.AllInvoice.as_view()),
    path('all/invoice/payments/<id>', views.AllInvoicePayments.as_view()),
    path('all/pending/invoices/<id>', views.AllPendingInvoice.as_view()),
    path('all/credit/invoices/<id>', views.AllCreditInvoice.as_view()),
    path('all/invoice/by/salesref/<id>', views.AllInvoiceBySalesRef.as_view()),
    path('all/invoice/by/distributor/<id>',
         views.AllInvoiceByDistributor.as_view()),
    path('all/invoice/by/dealer/<id>',
         views.AllInvoiceByDealer.as_view()),
    path('items/<id>', views.InvoiceItems.as_view()),
    path('item/update/<id>', views.InvoiceItemUpdate.as_view()),
    path('item/delete/<id>', views.InvoiceItemDelete.as_view()),

    path('create/invoice/items/', views.CreateInvoiceItems.as_view()),
]
