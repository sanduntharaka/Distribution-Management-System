from django.urls import path
from . import views
urlpatterns = [
    path('add/', views.AddDealer.as_view()),
    path('add/excel/', views.AddDealerExcel.as_view()),

    path('all/', views.GetAll.as_view()),
    path('all/by/distributor/<id>', views.GetAllByDistributor.as_view()),
    path('delete/<int:pk>', views.DeleteDealer.as_view()),
    path('edit/<int:pk>', views.EditDealerDetails.as_view()),
]
# dealer/all/by/distributor/
