from django.urls import path
from . import consumers



websocket_urlpatterns = [
    path('wss/remote/<int:userId>', consumers.GameConsumer.as_asgi())
]