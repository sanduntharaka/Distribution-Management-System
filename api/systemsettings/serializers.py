from rest_framework import serializers
from system_settings.models import SystemSettings


class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = ('__all__')


class VatRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = ('vat_percentage',)
