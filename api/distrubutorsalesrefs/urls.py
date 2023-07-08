from django.urls import path
from . import views
urlpatterns = [
    path('get/bysalesref/<int:id>', views.GetBySalesRef.as_view()),
    path('get/bydistributor/<int:id>', views.GetByDistributor.as_view()),
    path('get/bydistributor/single/<int:id>',
         views.GetByDistributorSingle.as_view()),

    path('get/distributor/by/salesref/<int:id>',
         views.GetDistributorBySr.as_view()),
    path('get/distributor/by/distributor/<int:id>',
         views.GetDistributorByDistributor.as_view()),
    path('all/', views.GetAlldistributorSalesRef.as_view()),
    path('all/distributor/<id>', views.GetAllByDistributor.as_view()),
    path('all/by/distributor/<id>', views.GetAllSalesrefsByDistributor.as_view()),
    path('all/by/manager/<id>', views.GetAllSalesrefsByManager.as_view()),
    path('all/by/executive/<id>', views.GetAllSalesrefsByDistributor.as_view()),

    path('create/', views.CreateDisributorSalesRef.as_view()),
    path('delete/<int:pk>', views.DeleteDisributorSalesRef.as_view()),
    path('inventory/bysalesref/<int:id>',
         views.GetinventoryBySalesref.as_view()),
    path('inventory/bydistributor/<int:id>',
         views.GetinventoryByDistributor.as_view()),

    # in stock items details
    path('inventory/items/<int:pk>', views.GetinventoryItems.as_view()),

]
