from django.urls import path
from . import views
urlpatterns = [
    path('add-distributor/', views.AddDistributorTargets.as_view()),
    path('show-distributor/', views.ViewDistributorTargets.as_view()),
    path('edit-distributor/<pk>', views.EditDistributorTargets.as_view()),
    path('delete-distributor/<pk>', views.DeleteDistributorTargets.as_view()),



    path('add-salesrep/', views.AddSalesrepTargets.as_view()),
    path('show-salesrep/', views.ViewSalesrepTargets.as_view()),
    path('edit-salesrep/<pk>', views.EditSalesrepTargets.as_view()),
    path('delete-salesrep/<pk>', views.DeleteSalesrepTargets.as_view()),




]

# "target/add-distributor/"
