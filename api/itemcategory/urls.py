from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateCategory.as_view()),
    path('update/<int:pk>', views.UpdateCategory.as_view()),
    path('delete/<int:pk>', views.DeleteCategory.as_view()),
    path('all/', views.AllCategory.as_view()),
]
# category/all/
