import json
from channels.generic.websocket import  AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Player
from .utils.constants import *
from .utils import game
import asyncio
remote_players = []
multi_players = []



class PlayerManager( ):
    
	def __is_player_playing( self, player ):
		return player in remote_players or player in multi_players

	async def start_game( self , player_set, mode):
		try:
			asyncio.create_task(game.launch_game( player_set, mode ))
		except Exception as e:
			self.send_error( e, GAME_ERROR_STATUS_CODE )

	def remove_player( self, player ):
		if player in remote_players:
			remote_players.remove( player )
		elif player in multi_players:
			multi_players.remove( player )

	def add_player( self, player, mode ):
		if mode is TWO_PLAYERS:
			remote_players.append(player)
		else: multi_players.append( player )
  
	@database_sync_to_async
	def __get_player_( self ):
		self.id = self.scope.get('user_id') 
		try:
			player = Player.objects.get( userId=self.id )
			return player
		except Player.DoesNotExist:
				raise ValueError( "No player was found")


class GameConsumer( AsyncWebsocketConsumer ):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.keycode= 0
		self.game_result = 'Won'
		self.game_group_name = ''
		self.playerModel = None
		self.player_manager = PlayerManager( )
  
	async def connect(self):
		await self.accept()
		self.playerModel= await self.player_manager.__get_player_( )
		if self.player_manager.__is_player_playing( self ):
			await self.send_error( 'Connection Error', GAME_ERROR_STATUS_CODE )
			return False
		await self._update_players(  )

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		dataType = dataJson['type']

		if (dataType == 'keycode'):
			self.keycode = dataJson['data']

	async def disconnect(self, close_code):
		self.keycode =  -1
		self.player_manager.remove_player( self )
		if self.game_group_name:
			await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

	async def _send_message_( self, type, data, code=SUCCES_STATUS_CODE ): 
		await self.send(text_data=json.dumps({
    		'type': type, 
    		'data': data, 
    		'code': code 
      }))

	async def send_error( self, error_message, code ): 
		await self._send_message_( 'error', error_message, code=code )
		await self.close( code=code )

	async def start(self, event): 
		await self._send_message_( 'start', event['data'] )

	async def api(self, event): 
		await self._send_message_( 'api', event['data'] )

	async def score(self, event):
		await self._send_message_( 'score', event['data'] )

	
class RemoteConsumer( GameConsumer, AsyncWebsocketConsumer ):
	async def _update_players( self ):
		self.player_manager.add_player( self )

		if len(remote_players) >= TWO_PLAYERS:
			players_set = [remote_players.pop(0) for _ in range(TWO_PLAYERS)]
			self.player_manager.start_game( players_set, TWO_PLAYERS )


class MultiplayerConsumer( GameConsumer, AsyncWebsocketConsumer ):
	async def _update_players( self ):
     
		multi_players.append(self)
		if len(multi_players) >= MULTI_PLAYERS:
			players_set = [remote_players.pop(0) for _ in range(MULTI_PLAYERS)]
			self.player_manager.start_game( players_set, MULTI_PLAYERS )
