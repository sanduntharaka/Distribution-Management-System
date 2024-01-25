from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateRoute.as_view()),
    path('get/<id>/<date>', views.GetSavedRoutes.as_view()),
    path('get/detail/', views.GetDetails.as_view()),
    path('get/detail/', views.GetDetails.as_view()),
    path('approve/<id>', views.ApproveRoute.as_view()),
    path('approve/to/', views.ToApprove.as_view()),



]
# 'planing/get/detail/<id>'
