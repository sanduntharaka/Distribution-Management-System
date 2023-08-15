from rest_framework import serializers
from sales_route.models import SalesRoute


class AddRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRoute
        fields = ('__all__')
