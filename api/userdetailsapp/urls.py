from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateUserDetails.as_view()),
    path('distributors/', views.AllDistributors.as_view()),
    path('salesrefs/', views.AllSalesRefs.as_view()),
    path('get/<id>', views.getUsersDetails.as_view()),
    path('get/user/<id>', views.getUsersDetailsByMainUser.as_view()),
]
