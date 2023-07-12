from django.urls import path
from . import views
urlpatterns = [
    path('all/', views.AllStaffDetails.as_view()),
    path('by/<id>', views.AllStaffDetailsBy.as_view()),
    # path('by/distributor/<id>', views.AllStaffDetailsByDistributor.as_view()),

]
# reports/staffdetails/all/
