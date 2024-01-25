from django.db import models
from userdetails.models import UserDetails
from django.contrib.postgres.fields import ArrayField
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
import json


class SalesRoute(models.Model):
    salesref = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='route_related_rep',)
    date = models.DateField(null=True, blank=True)
    psas = ArrayField(models.IntegerField(), null=True, blank=True)
    dealers = ArrayField(models.IntegerField())
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    approved_by = models.ForeignKey(
        UserDetails, on_delete=models.CASCADE, related_name='route_approved_by', null=True, blank=True)


class DailyStatus(models.Model):
    route = models.ForeignKey(SalesRoute, on_delete=models.CASCADE)
    current_plan = ArrayField(models.IntegerField())
    date = models.DateField(auto_created=True)
    coverd = ArrayField(models.JSONField())


# @receiver(post_save, sender=DailyStatus)
# def daily_status_post_save(sender, instance, **kwargs):
#     channel_layer = get_channel_layer()
#     route_name = instance.route.name  # Adjust this according to your SalesRoute model

#     async def send_update():
#         await channel_layer.group_send(
#             f'daily_status_{route_name}',
#             {
#                 'type': 'send.daily_status.update',
#                 'message': json.dumps({
#                     'route_name': route_name,
#                     'date': instance.date.strftime('%Y-%m-%d'),
#                     'coverd': instance.coverd
#                 })
#             }
#         )

#     asyncio.get_event_loop().run_until_complete(send_update())
