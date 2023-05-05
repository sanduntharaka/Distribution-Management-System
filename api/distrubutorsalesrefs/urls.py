from django.urls import path
from . import views
urlpatterns = [
    path('get/bysalesref/<int:id>', views.GetBySalesRef.as_view()),
    path('create/', views.CreateDisributorSalesRef.as_view()),
    path('inventory/<int:id>', views.Getinventory.as_view()),
    path('inventory/items/<int:pk>', views.GetinventoryItems.as_view()),
]
