import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import DailyStatus


class DailyStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.route_name = self.scope['url_route']['kwargs']['route_name']
        self.room_group_name = f'daily_status_{self.route_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def send_daily_status_update(self, event):
        await self.send(text_data=json.dumps(event['message']))
