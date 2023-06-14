from django.urls import path
from . import views
urlpatterns = [
    path('get/<id>', views.GetDistributorInventory.as_view()),
    path('items/add/', views.AddItems.as_view()),
    path('items/add/excel/', views.AddItemsExcel.as_view()),
    path('items/all/<pk>', views.GetDistributorItems.as_view()),
    path('items/edit/<int:pk>', views.EditDistributorItem.as_view()),
    path('items/delete/<int:pk>', views.DeleteDistributorItem.as_view())

]
# distributor/get
