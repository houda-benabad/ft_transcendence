from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("wss/online_status", consumers.OnlineStatusConsumer.as_asgi()),
]