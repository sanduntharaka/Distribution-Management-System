from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateSettingsDetails.as_view()),
    path('get/<int:pk>', views.GetSettingsDetails.as_view()),
    path('get/vat/', views.GetVatRate.as_view()),
    # get by distributor salesref value
    path('get/vat/<id>', views.GetVatRateByDistributorSrep.as_view()),



]
# settings/create/
