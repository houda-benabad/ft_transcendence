import json, time, asyncio, uuid
from typing import  Dict
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from abc import ABC, abstractmethod
from channels.db import database_sync_to_async
from collections import deque
from . import game
import requests
from .models import Player

remote_players = []
multi_players = []

class GameConsumer( ABC, AsyncWebsocketConsumer ):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.keycode= 0
		self.game_result = 'Won'
		self.game_group_name = ''
		self.playerModel = None

	async def _send_message_( self, type, data ):
		await self.send(text_data=json.dumps({ 'type': type, 'data': data }))

	async def send_error( self, error_message ):
		await self._send_message_( 'error', error_message )

	# Message handlers
	async def start(self, event): await self._send_message_( 'start', event['data'] )
	async def api(self, event): await self._send_message_( 'api', event['data'] )
	async def score(self, event):await self._send_message_( 'score', event['data'] )

	# Player handle
	async def _get_or_create_player_( self, userId, username): return await sync_to_async( Player.objects.get_or_create )( userId=userId, username=username )

class RemoteConsumer( GameConsumer, AsyncWebsocketConsumer ):
	async def connect(self):
		try:
			await self.accept()
		except Exception:
			self.send_error( "Connection rejected" )

	async def __handle_auth( self, token ):
		try:
			response = requests.get( f'http://user_management:8000/api/users/me', headers={"Host": "localhost", 'authorization': f"Bearer {token}" })

			if response.status_code != 200:
				self.disconnect( 404 )
				return self.send_error( "Connection rejected" )

			user_info = response.json(  )
			print( "userinfo = ", user_info)
			self.playerModel, created = await self._get_or_create_player_( user_info.get('userId') , user_info.get('username') )

			print( "this is user username = ", self.playerModel.username)
			remote_players.append(self)
			if len(remote_players) >= 2:
				await self.start_game()

		except Exception:
			print( "connection rejected" )
			self.send_error( "Connection rejected" )

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']

		if (dataType == 'keycode'):
			self.keycode = dataJson['data']
		elif dataType == 'auth' :
			await self.__handle_auth( dataJson['data'])
 
	async def start_game(self):
		players_set = [remote_players.pop(0) for num in range(2)]
		asyncio.create_task(game.startRemoteGame( players_set ))

	async def disconnect(self, close_code):
		self.keycode =  -1
		print(f"Game group name: {self.game_group_name}")
		if self.game_group_name:
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

class MultiPlayerConsumer(GameConsumer, AsyncWebsocketConsumer):

	async def connect(self):
		try:
			userId = self.scope['url_route']['kwargs']['userId']

			# send request to hind to check if user is authenticated

			await self.accept()
			multi_players.append(self)
			self.playerModel = await sync_to_async( Player.objects.get_or_create )( userId=userId )

			if len(multi_players) >= 4:
				await self.start_game()

		except Exception:
			self.send_error( "Connection rejected" )

	async def start_game(self, players):
		players_set = [remote_players.pop(0) for num in range(4)]
		asyncio.create_task(game.startMultiPlayerGame(self.channel_layer, players_set[0], players_set[1]))

	async def disconnect(self, close_code):
		self.keycode =  -1
		if ( self.game_group_name ):
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
		if multi_players:
			multi_players.remove(self)

