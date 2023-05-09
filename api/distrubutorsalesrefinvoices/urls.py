from django.urls import path
from . import views

urlpatterns = [
    path('create/invoice/', views.CreateInvoice.as_view()),
    path('all/invoice/', views.AllInvoice.as_view()),
    path('all/invoice/by/<id>', views.AllInvoiceBySalesRef.as_view()),
    path('items/<id>', views.InvoiceItems.as_view()),
    path('create/invoice/items/', views.CreateInvoiceItems.as_view()),
]
