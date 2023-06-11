from django.urls import path
from . import views
urlpatterns = [
    path('get/<id>', views.GetFocReport.as_view()),
]
# focreport/get/
