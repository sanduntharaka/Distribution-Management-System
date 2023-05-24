from django.urls import path
from . import views
urlpatterns = [
    path('get/bysalesref/<int:id>', views.GetBySalesRef.as_view()),
    path('get/bydistributor/<int:id>', views.GetByDistributor.as_view()),
    path('get/distributor/by/salesref/<int:id>',
         views.GetDistributorBySr.as_view()),

    path('all/', views.GetAlldistributorSalesRef.as_view()),
    path('all/distributor/<id>', views.GetAllByDistributor.as_view()),
    path('create/', views.CreateDisributorSalesRef.as_view()),
    path('delete/<int:pk>', views.DeleteDisributorSalesRef.as_view()),
    path('inventory/<int:id>', views.Getinventory.as_view()),
    path('inventory/items/<int:pk>', views.GetinventoryItems.as_view()),
]
