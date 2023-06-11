from django.urls import path
from . import views
urlpatterns = [
    path('password-reset-email/',
         views.PasswordResetEmail.as_view(), name='password-reset-request'),
    path('reset_password/',
         views.PasswordTokenCheck.as_view(), name='password-reset-confirm'),
]
