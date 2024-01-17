from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateRoute.as_view()),
    path('get/<id>/<day>', views.GetSavedRoutes.as_view()),
    path('get/detail/', views.GetDetails.as_view()),


]
# 'planing/get/detail/<id>'
