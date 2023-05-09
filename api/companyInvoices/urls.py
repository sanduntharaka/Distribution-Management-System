from django.urls import path
from . import views
urlpatterns = [
    path('all/', views.AllInvoices.as_view()),
    path('add/', views.AddInvoice.as_view()),
    path('add/items/<int:id>', views.AddInvoiceItems.as_view()),
    path('delete/<int:pk>', views.DeleteInvoice.as_view()),
    path('items/<id>', views.GetInvoiceItems.as_view()),

]
