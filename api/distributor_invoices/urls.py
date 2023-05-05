from django.urls import path
from . import views
urlpatterns = [
    path('all/', views.AllInvoices.as_view()),
    path('add/', views.AddInvoice.as_view()),
    path('inventory/all/<id>', views.AllDistributorInvoices.as_view()),
    path('inventory/items/<id>', views.InvoiceItems.as_view()),
]
