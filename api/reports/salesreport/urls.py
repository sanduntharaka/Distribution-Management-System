from django.urls import path
from . import views
urlpatterns = [
    path('date/', views.FilterByDate.as_view()),
    path('category/', views.FilterByCategory.as_view()),
    path('product/', views.FilterByProduct.as_view()),
    path('itenery/', views.IteneryReport.as_view()),
    path('productivity/', views.ProductivityReport.as_view()),



]


# salesdetails/productivity/
