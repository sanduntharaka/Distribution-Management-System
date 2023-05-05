from django.urls import path
from . import views
urlpatterns = [
    path('add/', views.AddReturn.as_view()),
    path('add/items/<id>', views.AddReturnItem.as_view()),
    path('get/', views.GetReturns.as_view()),
    path('get/<int:pk>', views.GetReturn.as_view()),
    path('get/items/<int:id>', views.GetReturnItems.as_view()),
    path('delete/<int:id>', views.DeleteReturn.as_view())
]
