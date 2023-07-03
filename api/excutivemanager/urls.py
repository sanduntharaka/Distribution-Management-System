from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateManagerExecutive.as_view()),
    path('all/', views.AllManagerExecutive.as_view()),
    path('by/executive/<id>', views.AllExecutiveManagerByExecutive.as_view()),
    path('delete/<int:pk>', views.DeleteManagerExecutive.as_view()),


]
# manager/distributor/delete/
