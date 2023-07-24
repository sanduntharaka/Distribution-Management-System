from django.urls import path
from . import views
urlpatterns = [
    path('date/', views.FilterByDate.as_view()),
]


# delevered-sales/distributor/date/<id>
