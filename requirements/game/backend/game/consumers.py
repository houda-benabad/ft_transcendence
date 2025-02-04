import json, asyncio
from channels.generic.websocket import  AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from . import game
import requests
from .models import Player
from .constants import TWO_PLAYERS, MULTI_PLAYERS

remote_players = []
multi_players = []


class GameConsumer( AsyncWebsocketConsumer ):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.keycode= 0
		self.game_result = 'Won'
		self.game_group_name = ''
		self.playerModel = None
  
	async def connect(self):
		await self.accept()

	async def _handle_auth( self, token ):
		try:
			response = requests.get( settings.USER_INFO_URL + 'me', headers={"Host": "localhost", 'authorization': f"Bearer {token}" })
			if response.status_code != 200:
				raise ValueError( "Connetion rejected" )
			user_info = response.json(  )
			self.playerModel= await self._get_player_( user_info.get('id') , user_info.get('username') )
		except Exception as e:
			await self.send_error( e, 401 )


	# Message handlers
	async def _send_message_( self, type, data, code=200 ): await self.send(text_data=json.dumps({ 'type': type, 'data': data, 'code': code }))
	async def send_error( self, error_message, code ): 
		await self._send_message_( 'error', error_message, code=code )
		await self.close( code=4000 )
	async def start(self, event): await self._send_message_( 'start', event['data'] )
	async def api(self, event): await self._send_message_( 'api', event['data'] )
	async def score(self, event):await self._send_message_( 'score', event['data'] )
	
	# Receiving messages
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
	def _get_player_( self, userId, username): 
		player = Player.objects.get( userId=userId )
		if not player:
			raise ValueError( "No player was found")
		return player

class RemoteConsumer( GameConsumer, AsyncWebsocketConsumer ):
	async def _update_players( self ):
		remote_players.append(self)

		if len(remote_players) >= TWO_PLAYERS:
			await self.start_game()

	async def start_game(self):
		try:
			players_set = [remote_players.pop(0) for num in range(TWO_PLAYERS)]
			asyncio.create_task(game.startRemoteGame( players_set, TWO_PLAYERS ))
		except Exception as e:
			self.send_error( e, 500 )
			

	async def disconnect(self, close_code):
		self.keycode =  -1
		if self in remote_players :
			remote_players.remove( self )
		if self.game_group_name:
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)


class MultiplayerConsumer( GameConsumer, AsyncWebsocketConsumer ):
	async def _update_players( self ):
     
		multi_players.append(self)
		if len(multi_players) >= MULTI_PLAYERS:
			await self.start_game()

	async def start_game(self):
		try:
			players_set = [multi_players.pop(0) for num in range(MULTI_PLAYERS)]
			asyncio.create_task(game.startRemoteGame( players_set , MULTI_PLAYERS))
		except Exception as e:
					self.send_error( e, 500 )

	async def disconnect(self, close_code):
		self.keycode =  -1
		if self in multi_players :
			multi_players.remove( self )
		if self.game_group_name:
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)



