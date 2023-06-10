from django.urls import path
from . import views
urlpatterns = [
    path('distributor/date/<id>', views.FilterByDateDistributor.as_view()),
]


# collectionsheet/distributor/date/<id>
