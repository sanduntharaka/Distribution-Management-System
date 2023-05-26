from django.urls import path
from . import views

urlpatterns = [

    path('all/', views.AllDealerDetails.as_view()),
    path('by/distributor/<id>', views.AllDealerDetailsByDistributor.as_view()),
    path('by/manager/<id>', views.AllDealerDetailsByManager.as_view()),
]
