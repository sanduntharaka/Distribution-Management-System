from django.urls import path
from . import views
urlpatterns = [
    path('date/', views.FilterByDate.as_view()),
]


# collectionsheet/distributor/date/<id>
