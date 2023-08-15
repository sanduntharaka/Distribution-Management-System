from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateRoute.as_view())
]
# 'planing/create/'
