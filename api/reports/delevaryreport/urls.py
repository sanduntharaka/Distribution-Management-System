from django.urls import path
from . import views
urlpatterns = [
    path('distributor/date/<id>', views.FilterByDateDistributor.as_view()),
    path('distributor/category/<id>', views.FilterByCategoryDistributor.as_view()),

]


# deleverydetails/distributor/date/<id>
