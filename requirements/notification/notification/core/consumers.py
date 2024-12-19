import json, time, asyncio, uuid
from typing import  Dict
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from collections import deque
from django.contrib.auth.models import User
from .models import Notification
from django.core import serializers
from .serializer import NotificationSerializer


class NotifConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.accept( )
		userId =  self.scope['url_route']['kwargs']['username']
		notifications = await self.get_notifications( userId )
		data = await sync_to_async(self.serialize_notifications)(notifications)
		await self.send( text_data=json.dumps(data) )

	@database_sync_to_async
	def get_notifications( self, username ):
		user =  User.objects.get( username=username )
		notifications = Notification.objects.filter( receiver=user )
		return notifications

	def serialize_notifications(self, notifications):
		serializer = NotificationSerializer(notifications, many=True)
		return serializer.data


	async def receive(self, text_data):
		pass
	async def disconnect(self, close_code):
		print( "disconnected" )