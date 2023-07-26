from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddNotBuy.as_view()),
    path('get/', views.GeTAllNotBuy.as_view()),
    path('get/salesref/<id>', views.GeTAllNotBuyBysSalesRef.as_view()),
    path('get/filter/', views.GeTAllNotBuyBysSalesRefFilter.as_view()),

    # get by others by distributor user details id
    path('get/others/<id>', views.GeTAllNotBuyBysOthers.as_view()),

    path('edit/<int:pk>', views.EditNotBuy.as_view()),
    path('delete/<int:pk>', views.DeleteNotBuy.as_view()),
]
