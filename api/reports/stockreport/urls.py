from django.urls import path
from . import views
urlpatterns = [
    path('get/<id>', views.GetInventoryReport.as_view()),
    path('get/by/date/', views.GetInventoryReportByDate.as_view()),

]
# reports/stockdetails/get/by/date/
