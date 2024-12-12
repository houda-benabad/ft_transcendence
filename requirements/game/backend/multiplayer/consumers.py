import json, time, asyncio
from typing import  Dict
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from collections import deque
from . import models,  game
import uuid

players  = []

class GameConsumer(AsyncWebsocketConsumer):
	gameOption = {}	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game_group_name = ""
		self.keycode= 0
		self.game_result = ''

	async def connect(self):
		await self.accept()
		players.append(self)
		await self.send(text_data=json.dumps({
			'type': 'Connected',
		}))
		print( 'CONSUMERS = ', len(players))
		if len(players) >= 4:
			await self.start_game(players)

	async def start_game(self, players):
		players_set = []
		id = uuid.uuid4()
		for num in range(4):
			consumer = players.pop(0)
			consumer.game_group_name = f"game_{id}"
			await self.channel_layer.group_add(consumer.game_group_name,consumer.channel_name)
			players_set.append(consumer)
		print('GAME GONNA START')
		await asyncio.sleep(3)
		asyncio.create_task(game.startGame(self.channel_layer, players_set))

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']

		if (dataType == 'keycode'):
			self.keycode = dataJson['data']
   
	async def api(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'api',
			'data': data
		}))

	async def score(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'score',
			'data': data
		}))

	async def disconnect(self, close_code):
		print('game name = ', self.game_group_name)
		self.keycode =  -1
		if ( self.game_group_name ):
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
		if players:
			players.remove(self)
		print( 'CONSUMERS = ', len(players))
