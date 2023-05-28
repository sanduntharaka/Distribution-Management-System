from django.urls import path
from . import views

urlpatterns = [
    path('by/distributor/date/<id>', views.GetByDistributor.as_view()),
    path('by/distributor/period/<id>', views.GetByDistributorPeriod.as_view()),
    path('returns/by/distributor/period/<id>',
         views.ReturnsGetByDistributorPeriod.as_view()),


    # path('by/manager/<id>', views.GetByManager.as_view()),

]
# cheque/by/distributor/date/<id>
