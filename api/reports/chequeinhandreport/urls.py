from django.urls import path
from . import views

urlpatterns = [
    path('get/date/', views.GetByDate.as_view()),
    path('by/period/', views.GetByPeriod.as_view()),
    path('returns/by/period/',
         views.ReturnsGetByPeriod.as_view()),


    # path('by/manager/<id>', views.GetByManager.as_view()),

]
# cheque/by/distributor/date/<id>
