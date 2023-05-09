from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddLeave.as_view()),
    path('all/salesref/<id>', views.AllByIdLeave.as_view()),

]
