from django.urls import path
from . import views

urlpatterns = [
    path('by/distributor/<id>', views.GetByDistributor.as_view()),
    path('by/manager/<id>', views.GetByManager.as_view()),

]
# mkreturns/by/distributor/<id>
