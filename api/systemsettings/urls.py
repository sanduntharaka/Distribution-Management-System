from django.urls import path
from . import views
urlpatterns = [
    path('create/', views.CreateSettingsDetails.as_view()),
]
# settings/create/
