from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreatePSA.as_view()),
    path('all/', views.AllCreatedPsa.as_view()),
]
