import json, asyncio
from channels.generic.websocket import  AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from .utils import game
import requests
from .models import Player
from .utils.constants import *

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
		self.playerModel= await self._get_player_( )
		if self._is_already_playing(  ):
			await self.send_error( 'Connection Error', GAME_ERROR_STATUS_CODE )
			self.close( )
			return False
		await self._update_players(  )

	def _is_already_playing( self ):
		for player in remote_players:
			if player.id == self.id:
				return True
		for player in multi_players:
			if player.id == self.id:
				return True
		return False

	async def _send_message_( self, type, data, code=SUCCES_STATUS_CODE ): 
		if type == 'start':
			data['author'] = self.playerModel.userId
		await self.send(text_data=json.dumps({ 'type': type, 'data': data, 'code': code }))
	async def send_error( self, error_message, code ): 
		await self._send_message_( 'error', error_message, code=code )
		await self.close( code=code )
	async def start(self, event):
		await self._send_message_( 'start', event['data'] )
	async def api(self, event): await self._send_message_( 'api', event['data'] )
	async def score(self, event):await self._send_message_( 'score', event['data'] )
	
	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']

		if (dataType == 'keycode'):
			self.keycode = dataJson['data']

	@database_sync_to_async
	def _get_player_( self ):
		self.id = self.scope.get('user_id') 
		player = Player.objects.get( userId=self.id )
		if not player:
			raise ValueError( "No player was found")
		return player

class RemoteConsumer( GameConsumer ):
	async def _update_players( self ):
		for player in remote_players:
			await player._send_message_( 'matchmaking', len(remote_players) )
		remote_players.append(self)
		if len(remote_players) >= TWO_PLAYERS:
			await self.start_game()

	async def start_game(self):
		try:
			players_set = [remote_players.pop(0) for num in range(TWO_PLAYERS)]
			asyncio.create_task(game.startRemoteGame( players_set, TWO_PLAYERS ))
		except Exception as e:
			self.send_error( e, GAME_ERROR_STATUS_CODE )
			

	async def disconnect(self, close_code):
		print("GETTING OUT")
		self.keycode =  -1
		if self in remote_players :
			remote_players.remove( self )
		if self.game_group_name:
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)


class MultiplayerConsumer( GameConsumer):
	async def _update_players( self ):
		multi_players.append(self)
		if len(multi_players) >= MULTI_PLAYERS:
			await self.start_game()

	async def start_game(self):
		try:
			players_set = [multi_players.pop(0) for num in range(MULTI_PLAYERS)]
			asyncio.create_task(game.startRemoteGame( players_set , MULTI_PLAYERS))
		except Exception as e:
			self.send_error( e, GAME_ERROR_STATUS_CODE )

	async def disconnect(self, close_code):
		self.keycode =  -1
		if self in multi_players :
			multi_players.remove( self )
		if self.game_group_name:
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)





