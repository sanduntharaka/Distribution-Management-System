from django.urls import path
from . import views
urlpatterns = [
    path('inv/add/excel/<int:id>', views.AddInvoiceExcel.as_view()),
    path('inv/add/', views.AddInvoice.as_view()),
    path('inv/view/all/<id>', views.ViewInvoices.as_view()),
    path('cheque/add/excel/<int:id>', views.AddChequeExcel.as_view()),
    path('cheque/add/', views.AddCheque.as_view()),
]
