from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateCategory.as_view()),
    path('all/', views.AllCreatedCategories.as_view()),
    path('edit/<int:pk>', views.EditCategory.as_view()),
    path('delete/<int:pk>', views.DeleteCategory.as_view()),
]
