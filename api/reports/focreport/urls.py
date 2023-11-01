from django.urls import path
from . import views
urlpatterns = [
    path('get/', views.GetFocReport.as_view()),
    path('free/get/', views.GetFreeIssuesReport.as_view()),
]
# focreport/get/
