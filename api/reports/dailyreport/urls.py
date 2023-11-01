from django.urls import path
from . import views
urlpatterns = [
    path('get/', views.GetDailyReport.as_view()),
]

# daily-report/
