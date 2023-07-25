from django.urls import path
from . import views
urlpatterns = [
    path('purchase/date/',
         views.FilterPurchaseByDate.as_view()),
    path('payment/date/',
         views.FilterPaymentByDate.as_view()),
    path('purchase/distributor/data/<id>',
         views.GetPurchaseDataByDistributor.as_view()),
    path('payment/distributor/data/<id>',
         views.GetPaymentDataByDistributor.as_view()),
]


# dealer-pattern/purchase/distributor/date/<id>
