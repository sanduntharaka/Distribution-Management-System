from django.urls import path
from . import views
urlpatterns = [
    path('add/', views.AddReturn.as_view()),
    path('add/items/<id>', views.AddReturnItem.as_view()),
    path('get/', views.GetReturns.as_view()),
    path('get/<int:pk>', views.GetReturn.as_view()),
    path('get/distributor/<id>', views.GetReturnsByDistributor.as_view()),
    path('get/salesref/<id>', views.GetReturnsByDSalesref.as_view()),
    path('get/by/others/distributor/<id>', views.GetReturnsByOthers.as_view()),


    path('get/pending/', views.GetPendingReturns.as_view()),
    path('update/status/<int:pk>', views.UpdateStatusPendingReturns.as_view()),
    path('get/pending/distributor/<id>',
         views.GetPendingReturnsByDistributor.as_view()),
    path('get/items/<int:id>', views.GetReturnItems.as_view()),
    path('update/item/<int:pk>', views.UpdateReturnItem.as_view()),
    path('delete/item/<int:pk>', views.DeleteReturnItem.as_view()),


    path('delete/<int:id>', views.DeleteReturn.as_view())
]
