from django.urls import path
from . import views
urlpatterns = [
    path('all/', views.AllInvoices.as_view()),
    path('add/', views.AddInvoice.as_view()),
    path('items/<id>', views.GetInvoiceItems.as_view()),

]
