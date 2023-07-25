from django.urls import path
from . import views
urlpatterns = [
    path('get/', views.GetFocReport.as_view()),
]
# invent-status/get/
