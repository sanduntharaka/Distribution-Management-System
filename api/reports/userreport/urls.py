from django.urls import path
from . import views
urlpatterns = [
    path('all/', views.AllStaffDetails.as_view()),
    path('by/manager/<id>', views.AllStaffDetailsByManager.as_view()),
    path('by/distributor/<id>', views.AllStaffDetailsByDistributor.as_view()),

]
# reports/staffdetails/all/
