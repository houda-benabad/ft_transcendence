from django.urls import re_path
from . import consumers



websocket_urlpatterns = [
    re_path(r'ws/tourn/$', consumers.GameConsumer.as_asgi())
]