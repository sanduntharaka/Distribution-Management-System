from django.urls import path
from . import views
urlpatterns = [
    path('add/', views.AddInventory.as_view()),
    path('add/from/excel/', views.AddInventoryFromExcel.as_view()),
    path('all/', views.ListProducts.as_view()),
    path('<id>/', views.Getproduct.as_view()),
    path('edit/<pk>', views.EditProduct.as_view()),
    path('delete/<pk>', views.DeleteProduct.as_view()),



]
