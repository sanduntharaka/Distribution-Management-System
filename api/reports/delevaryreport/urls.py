from django.urls import path
from . import views
urlpatterns = [
    path('date/', views.FilterByDate.as_view()),
    path('category/', views.FilterByCategory.as_view()),

]


# deleverydetails/distributor/date/<id>
