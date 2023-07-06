from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateManagerDistributor.as_view()),
    path('all/', views.AllManagerDistributor.as_view()),
    path('by/manager/<id>', views.AllManagerDistributorByManager.as_view()),
    path('by/executive/<id>', views.AllManagerDistributorByExecutive.as_view()),

    path('delete/<int:pk>', views.DeleteManagerDistributor.as_view()),


]
# manager/distributor/delete/
