from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"wss/online_status", consumers.OnlineStatusConsumer.as_asgi()),
]