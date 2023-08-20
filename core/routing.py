from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from sales_route.consumers import DailyStatusConsumer
print('im')
application = ProtocolTypeRouter({
    "websocket": URLRouter([
        re_path(r'^ws/daily_status/nextdealer/$',
                DailyStatusConsumer.as_asgi()),
    ]),
})
