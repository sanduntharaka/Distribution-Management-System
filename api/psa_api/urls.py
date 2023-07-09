from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreatePSA.as_view()),
    path('all/', views.AllCreatedPsa.as_view()),
    path('all/search', views.GetAllSearch.as_view()),
    path('edit/<int:pk>', views.EditPsa.as_view()),
    path('delete/<int:pk>', views.DeletePsa.as_view()),
]
