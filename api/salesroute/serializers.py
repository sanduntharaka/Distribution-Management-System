from rest_framework import serializers
from sales_route.models import SalesRoute
from primary_sales_area.models import PrimarySalesArea


class AddRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRoute
        fields = ('__all__')


class ToApproveSeraializer(serializers.ModelSerializer):
    salesref_name = serializers.CharField(source='salesref.full_name')

    psas_area_names = serializers.SerializerMethodField()

    def get_psas_area_names(self, instance):
        psa_ids = instance.psas
        if psa_ids:
            psas = PrimarySalesArea.objects.filter(id__in=psa_ids)
            return [psa.area_name for psa in psas]
        return []

    class Meta:
        model = SalesRoute
        fields = ('id', 'salesref', 'salesref_name', 'date', 'psas_area_names')
