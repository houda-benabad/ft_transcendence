from django.urls import re_path
from . import consumers



websocket_urlpatterns = [
    re_path(r'wss/remote/$', consumers.GameConsumer.as_asgi())
]