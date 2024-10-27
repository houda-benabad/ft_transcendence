import json, time, asyncio
from typing import  Dict
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from collections import deque
from . import models,  game

channels : Dict[str, Dict[str, 'GameConsumer']] = {}

class GameConsumer(AsyncWebsocketConsumer):
	gameOption = {}	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game = None
		self.is_host = False
		self.game_group_name = ""
		self.keycode= 0
		self.game_result = 0

	async def connect(self):
		await self.accept()

		self.game = await self.get_or_create_game()
		self.game_group_name = f"game-{self.game.id}"
  
		if not self.game_group_name in channels :
			channels[self.game_group_name] = {
				'hoster' : '',
				'invited': ''
			}
   
		print("group name = ", self.game_group_name)

		await self.channel_layer.group_add(self.game_group_name,self.channel_name)

		if self.is_host:
			channels[self.game_group_name]['hoster'] = self
			print("IS HOST")
			await self.send(text_data=json.dumps({
				'type' : 'gameInfo',
				'data' : 'game_options'
			}))
   
		else:
			print("IS INVITED")
			channels[self.game_group_name]['invited'] = self
			await self.send(text_data=json.dumps({
				'type' : 'startGame',
				'data' : self.game.settings
			}))
			await asyncio.sleep(3)
			await self.start_game()

	@database_sync_to_async
	def get_or_create_game(self):
		game = models.Game.objects.filter(gameStatus='WAITING', player_count=1).first()
		if game :
			self.is_host = False
			game.player_count += 1
			game.save()
			return game
		else:
			self.is_host = True
			return models.Game.objects.create(player_count=1, gameStatus='WAITING')

	async def start_game(self):
		hoster = channels[self.game_group_name]['hoster']
		invited = channels[self.game_group_name]['invited']
		if (invited and hoster):
			print('GAME START')
			asyncio.create_task(game.startGame(self.channel_layer, hoster, invited))
		else:
			print('GAME ERROR')

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
