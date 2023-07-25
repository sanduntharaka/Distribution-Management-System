from django.urls import path
from . import views
urlpatterns = [
    path('date/', views.FilterByDate.as_view()),
]


# credit-collection/distributor/date/<id>
