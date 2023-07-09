from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateExecutiveDistributor.as_view()),
    path('all/', views.AllDistributorExecutive.as_view()),
    path('by/manager/<id>', views.AllExecutiveDistributorByManager.as_view()),
    path('delete/<int:pk>', views.DeleteDistributorExecutive.as_view()),


]
# manager/distributor/delete/
