from django.urls import path
from . import views
urlpatterns = [
    path('distributor/date/<id>', views.FilterByDateDistributor.as_view()),
]


# foc-normal/distributor/date/<id>
