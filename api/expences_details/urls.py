from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.AddExpences_details.as_view()),
    path('all/<int:id>', views.AllExpences_details.as_view()),
    path('edit/<int:pk>', views.EditExpences_details.as_view()),
    path('delete/<int:pk>', views.DeleteExpences_details.as_view()),


]

# expences/create/
