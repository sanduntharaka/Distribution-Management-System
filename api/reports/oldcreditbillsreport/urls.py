from django.urls import path
from . import views
urlpatterns = [
    path('distributor/date/inv/<id>',
         views.FilterByDateDistributorInvoice.as_view()),
    path('distributor/date/cheque/<id>',
         views.FilterByDateDistributorCheque.as_view()),
]


# oldcredit/distributor/date/<id>
