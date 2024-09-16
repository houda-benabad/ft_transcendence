import json, time, asyncio
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from collections import deque
from . import models,  game

players=deque()

class GameConsumer(AsyncWebsocketConsumer):

	async def connect(self):

		# # INTERNAL CONNECTION
		await self.accept()
		await self.channel_layer.group_add("invite",self.channel_name)

		# # PLAYER CREATION
		self.keycode= 0
		players.append(self)

		# # GAME LAUNCH
		user = models.Player( name="user" )
		await sync_to_async( user.save )()
		match = models.Game( points=0, type="VS", player_id=user.pk )
		await sync_to_async( match.save )()

		self.match = match
		if (len(players) >= 2):
			second = players.pop()
			first = players.pop()
			asyncio.create_task(game.startGame(self.channel_layer, first, second))

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		if (dataJson['type'] == 'keycode'):
			data = dataJson['data']
		self.keycode = data
  
	async def coordinates(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'msg',
			'data': data
		}))
	
	async def message(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'msg',
			'data': data
		}))
 
	async def disconnect(self, close_code):
		print("BYE BYE : ", close_code)
