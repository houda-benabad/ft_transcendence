import json, time, asyncio
from typing import  Dict
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from collections import deque
from . import models,  game

players  = []

class GameConsumer(AsyncWebsocketConsumer):
	gameOption = {}	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game = None
		self.game_group_name = ""
		self.keycode= 0
		self.game_result = 0

	async def connect(self):
		print('MULTI ')
		await self.accept()

		self.game = await self.get_or_create_game()
		players.append(self)
		self.game_group_name = f"multi-{self.game.id}"
   
		print("group name = ", self.game_group_name)
		await self.channel_layer.group_add(self.game_group_name,self.channel_name)
		# if len(players) >= 4:
		# 	await self.start_game(players)

	@database_sync_to_async
	def get_or_create_game(self):
		game = models.Game.objects.filter(gameStatus='WAITING', player_count__lt=4).first()
		if game :
			game.player_count += 1
			game.save()
			return game
		else:
			return models.Game.objects.create(player_count=1, gameStatus='WAITING')

	async def start_game(self, players):
		players_set = [players.pop() for num in range(4)]
		print('GAME GONNA START')
		asyncio.create_task(game.startGame(self.channel_layer, players_set))

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']

		if (dataType == 'keycode'):
			self.keycode = dataJson['data']

		elif (dataType == 'gameSettings' and self.is_host):
			self.game.settings = dataJson['data']
			await sync_to_async(self.game.save)()
   
	async def api(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'api',
			'data': data
		}))
  
	async def time(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'time',
			'data': data
		}))

	async def discard(self, event):
		data = event['data']
		await self.send(text_data=json.dumps({
			'type': 'discard',
			'data': data
		}))

	async def disconnect(self, close_code):
		self.keycode =  -1
		print(f"BYE BYE {self.game_group_name}"),
		await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
		if (self.game.gameStatus == 'WAITING' and self.is_host):
			await sync_to_async(self.game.delete)()
