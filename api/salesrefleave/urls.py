from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddLeave.as_view()),
    path('all/<id>', views.AllByIdLeave.as_view()),
    path('all/user/<id>', views.AllByUserId.as_view()),
    path('all/by/company/', views.ManagerLeaves.as_view()),
    path('all/by/manager/<id>', views.AllByManagerIdLeave.as_view()),

    path('approve/<id>',
         views.ApproveByIdLeave.as_view()),
    path('delete/<int:pk>', views.DeleteLeave.as_view()),
]
