import json, time, asyncio, uuid
from typing import  Dict
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from collections import deque
from . import models,  game

players = []

class GameConsumer(AsyncWebsocketConsumer):
	gameOption = {}	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.keycode= 0
		self.game_result = 'Won'
		self.game_group_name = ''

	async def connect(self):
		await self.accept()
		await self.send(text_data=json.dumps({
			'type': 'Connected',
		}))

		players.append(self)
		print('PLAYERS NUM = ', len(players))

		if  len(players) >= 2:
			await self.start_game()

	async def start_game(self):
		players_set = [players.pop(0) for num in range(2)]
		asyncio.create_task(game.startGame(self.channel_layer, players_set[0], players_set[1]))

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
		self.keycode =  -1
		await self.channel_layer.group_discard(self.game_group_name, self.channel_name)