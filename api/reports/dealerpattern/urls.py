from django.urls import path
from . import views
urlpatterns = [
    path('purchase/distributor/date/<id>',
         views.FilterPurchaseByDateDistributor.as_view()),
    path('payment/distributor/date/<id>',
         views.FilterPaymentByDateDistributor.as_view()),
    path('purchase/distributor/data/<id>',
         views.GetPurchaseDataByDistributor.as_view()),
    path('payment/distributor/data/<id>',
         views.GetPaymentDataByDistributor.as_view()),
]


# dealer-pattern/purchase/distributor/date/<id>
