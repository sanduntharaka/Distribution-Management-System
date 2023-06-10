from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from system_settings.models import SystemSettings
from users.models import UserAccount
from . import serializers
from django.shortcuts import get_object_or_404, get_list_or_404


class CreateSettingsDetails(generics.CreateAPIView):
    queryset = SystemSettings.objects.all()
    serializer_class = serializers.SystemSettingsSerializer
