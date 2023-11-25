from django.contrib import admin
from .models import DistributorTargets, SalesrefTargets,SalesrefValueTarget

admin.site.register(DistributorTargets)
admin.site.register(SalesrefTargets)
admin.site.register(SalesrefValueTarget)

