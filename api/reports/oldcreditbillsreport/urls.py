from django.urls import path
from . import views
urlpatterns = [
    path('date/inv/',
         views.FilterByDateInvoice.as_view()),
    path('date/cheque/',
         views.FilterByDaterCheque.as_view()),
]


# oldcredit/distributor/date/<id>
