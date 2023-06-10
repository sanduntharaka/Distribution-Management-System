from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddLeave.as_view()),
    path('all/salesref/<id>', views.AllByIdLeave.as_view()),
    path('all/by/distributor/<id>', views.AllByDistributorIdLeave.as_view()),
    path('all/by/manager/<id>', views.AllByManagerIdLeave.as_view()),

    path('approve/by/manager/<id>',
         views.ApproveByManagerIdLeave.as_view()),
    path('delete/<int:pk>', views.DeleteLeave.as_view()),
]
