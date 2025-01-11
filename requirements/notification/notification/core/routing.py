from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('wss/notification/', consumers.NotifConsumer.as_asgi())
]