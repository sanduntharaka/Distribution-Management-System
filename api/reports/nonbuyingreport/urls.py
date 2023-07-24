from django.urls import path
from . import views

urlpatterns = [
    path('by/date/', views.GetByData.as_view()),
    # path('by/manager/<id>', views.GetByManager.as_view()),

]
# non-buying/by/distributor/date/<id>
