import json, time, asyncio, uuid
from typing import  Dict
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from abc import ABC, abstractmethod
from channels.db import database_sync_to_async
from django.conf import settings
from collections import deque
from . import game
import requests
from .models import Player

remote_players = []
multi_players = []
TWO_PLAYERS = 2
MULTI_PLAYERS = 4

class GameConsumer( ABC, AsyncWebsocketConsumer ):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.keycode= 0
		self.game_result = 'Won'
		self.game_group_name = ''
		self.playerModel = None
  
	async def connect(self):
		try:
			await self.accept()
		except Exception:
			self.send_error( "Connection rejected" )
  
	async def _handle_auth( self, token ):
		try:
			response = requests.get( settings.USER_INFO_URL + 'me', headers={"Host": "localhost", 'authorization': f"Bearer {token}" })

			if response.status_code != 200:
				self.disconnect( 404 )
				return self.send_error( "Connection rejected" )

			user_info = response.json(  )
			print( "userinfo = ", user_info)
			self.playerModel, created = await self._get_or_create_player_( user_info.get('id') , user_info.get('username') )

			print( "this is user username = ", self.playerModel.username)
			print( "this is user userId = ", self.playerModel.userId)

		except Exception:
			print( "connection rejected" )
			self.send_error( "Connection rejected" )

	async def _send_message_( self, type, data ):
		await self.send(text_data=json.dumps({ 'type': type, 'data': data }))

	async def send_error( self, error_message ):
		await self._send_message_( 'error', error_message )

	# Message handlers
	async def start(self, event): await self._send_message_( 'start', event['data'] )
	async def api(self, event): await self._send_message_( 'api', event['data'] )
	async def score(self, event):await self._send_message_( 'score', event['data'] )

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']

		if (dataType == 'keycode'):
			self.keycode = dataJson['data']
		elif dataType == 'auth' :
			await self._handle_auth( dataJson['data'])
			await self._update_players(  )
	# Player handle
	@database_sync_to_async
	def _get_or_create_player_( self, userId, username): return Player.objects.get_or_create( userId=userId, username=username )

class RemoteConsumer( GameConsumer, AsyncWebsocketConsumer ):
	async def _update_players( self ):
		remote_players.append(self)
		print( "LEN PLAYERS = ", len( remote_players) )

		if len(remote_players) >= TWO_PLAYERS:
			await self.start_game()

	async def start_game(self):
		players_set = [remote_players.pop(0) for num in range(TWO_PLAYERS)]
		asyncio.create_task(game.startRemoteGame( players_set, TWO_PLAYERS ))

	async def disconnect(self, close_code):
		self.keycode =  -1
		remote_players.remove( self )
		print( "LEN PLAYERS = ", len( remote_players) )
		if self.game_group_name:
			print(f"Game group name: {self.game_group_name}")
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)


class MultiplayerConsumer( GameConsumer, AsyncWebsocketConsumer ):
	async def connect(self):
		try:
			await self.accept()
		except Exception:
			self.send_error( "Connection rejected" )

	async def _update_players( self ):
			multi_players.append(self)
			if len(multi_players) >= MULTI_PLAYERS:
				print( "multi game starting soon")
				await self.start_game()

	async def start_game(self):
		players_set = [multi_players.pop(0) for num in range(MULTI_PLAYERS)]
		asyncio.create_task(game.startRemoteGame( players_set , MULTI_PLAYERS))

	async def disconnect(self, close_code):
		self.keycode =  -1
		multi_players.remove( self )
		print(f"Game group name: {self.game_group_name}")
		if self.game_group_name:
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)


