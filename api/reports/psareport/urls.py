from django.urls import path
from . import views
urlpatterns = [
    path('distributor/<id>', views.ByDistributor.as_view()),
    # path('distributor/category/<id>', views.FilterByCategoryDistributor.as_view()),

]


# reports/psadetails/distributor/<id>
