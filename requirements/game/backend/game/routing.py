from django.urls import path
from . import consumers



websocket_urlpatterns = [
    path('wss/remote/<str:username>', consumers.GameConsumer.as_asgi())
]