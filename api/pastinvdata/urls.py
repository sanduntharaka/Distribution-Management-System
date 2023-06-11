from django.urls import path
from . import views
urlpatterns = [
    path('inv/add/excel/<int:id>', views.AddInvoiceExcel.as_view()),
    path('inv/add/', views.AddInvoice.as_view()),
    path('inv/update/<int:pk>', views.UpdateInvoice.as_view()),
    path('inv/delete/<int:pk>', views.DeleteInvoice.as_view()),
    path('inv/view/all/<id>', views.ViewInvoices.as_view()),
    path('cheque/add/excel/<int:id>', views.AddChequeExcel.as_view()),
    path('cheque/add/', views.AddCheque.as_view()),
    path('cheque/view/all/<id>', views.ViewCheque.as_view()),
    path('cheque/update/<int:pk>', views.UpdateCheque.as_view()),
    path('cheque/delete/<int:pk>', views.DeleteCheque.as_view()),

]
