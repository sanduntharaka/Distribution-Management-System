from django.urls import path
from . import views
urlpatterns = [
    path('get/<id>', views.GetDistributorInventory.as_view()),
    path('items/add/', views.AddNewItems.as_view()),
    path('stoks/add/', views.AddExistingItems.as_view()),
    path('items/add/excel/', views.AddItemsExcel.as_view()),

    # get DistributorInventoryItems details
    path('all/<id>', views.GetDistributorInventoryItems.as_view()),

    # get DistributorInventoryItems for company, manager and executive id is usedetails_id
    path('by/others/<id>', views.GetDistributorInventoryItemsByUser.as_view()),

    # get ItemStock details
    path('items/all/<pk>', views.GetDistributorItems.as_view()),

    path('items/edit/<int:pk>', views.EditDistributorItem.as_view()),
    path('stoks/edit/<int:pk>', views.EditDistributorItemStock.as_view()),

    path('items/delete/<int:pk>', views.DeleteDistributorItem.as_view()),
    path('stoks/delete/<int:pk>', views.DeleteDistributorStock.as_view()),
    path('salesrefs/<id>', views.AllSalesrefsByDistributor.as_view()),

    path('details/<code>', views.GetProductDetails.as_view()),

]
# distributor/items/add/
