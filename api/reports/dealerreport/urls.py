from django.urls import path
from . import views

urlpatterns = [

    path('all/', views.AllDealerDetails.as_view()),
    path('by/<id>', views.AllDealerDetailsBy.as_view()),
    path('by/manager/<id>', views.AllDealerDetailsByManager.as_view()),
]
