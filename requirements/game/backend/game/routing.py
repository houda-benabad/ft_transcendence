from django.urls import path
from . import consumers



websocket_urlpatterns = [
    path('wss/remote', consumers.RemoteConsumer.as_asgi()),
    path('wss/multiplayer/<int:userId>', consumers.MultiPlayerConsumer.as_asgi()),
    
]