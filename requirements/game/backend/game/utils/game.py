from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
import asyncio
from .components import *
from .constants  import *
from .. import models

class GameServer(  ):
    # GENERIC
	def __init__( self, consumers, mode ):
		self.mode = mode
		self.channel_layer = get_channel_layer(  )
		self.consumers = consumers
		self.components = Components( self.mode )

	async def __send_group_msg_( self, type, data ):
		await self.channel_layer.group_send( self.group_name,
			{
				'type': type,
				'data': data
			}
		)

	async def setup( self ):
		self.group_name = f"game-{self.gameModel.id}"
	
		for consumer in self.consumers:
			consumer.game_group_name = self.group_name
			await self.channel_layer.group_add( self.group_name, consumer.channel_name )

		await asyncio.sleep( GAME_START_DELAY )
 		
	async def loop( self ):
		await self.__send_group_msg_( 'start', 'game is starting' )

		while True:
			self.game.update( )

			if ( any( consumer.keycode == -1 for consumer in self.consumers )):
				break
			
			# MOVEMENT 
			self.game.move_players( self.consumers )
			

			await self.__send_group_msg_( 'api', self.game.get_coordinates() )
			await self.__send_group_msg_( 'score', self.get_score(  ) )
			# self.GAME OVER CHECK
			if await self.game.is_over():
				break

			await asyncio.sleep( GAME_TICK_RATE )
			
	async def results( self ):
		self.components.end_game_results(self.consumers, self.gameModel)
		for consumer in self.consumers:
			await consumer._send_message_( 'endGame',{ 'state' : consumer.game_result } )
		await self._save_to_database( )

	@database_sync_to_async
	def _save_to_database( self ):
		for i, consumer in enumerate( self.consumers ):
			consumer.playerModel.total_games += 1
			consumer.playerModel.total_points += self.game.players[i].score
			consumer.playerModel.save()
		self.gameModel.save()



class TwoPlayerGame( GameServer ):
	def __init__( self, consumers, mode ):
		super.__init__( consumers, mode)
		self.components = TwoPlayerComponents( self.mode )

    
	async def setup( self ):
		self.gameModel = await sync_to_async( models.RemoteGame.objects.create )( 
			player1=self.consumers[0].playerModel,
			player2=self.consumers[1].playerModel
		)
		super.setup( )
  
	def get_score(  self ):
		return {
			'name' :{
				'p1' :	self.consumers[0].playerModel.username,
				'p2' :	self.consumers[1].playerModel.username
			},
			'score' :{
				'p1' : self.game.players[0].score,
				'p2' : self.game.players[1].score,
			}
		}
  
	def saving_to_database( self ):
		self.gameModel.player1_points = self.game.players[0].score
		self.gameModel.player2_points = self.game.players[1].score
		super.saving_to_database( )
  
class MultiPlayerGame( GameServer ):
	def __init__( self, consumers, mode ):
		super.__init__( consumers, mode)
		self.components = MultiPlayerComponents( self.mode )

	async def setup( self ):
		self.gameModel = await sync_to_async( models.MultiplayerGame.objects.create )( 
				player1=self.consumers[0].playerModel,
				player2=self.consumers[1].playerModel,
				player3=self.consumers[2].playerModel,
				player4=self.consumers[3].playerModel
			)
		super.setup( )
  
	def get_score(  self ):
		return {
			'score' :{
				'p1' : self.game.players[0].score,
				'p2' : self.game.players[2].score,
			}
		}

	def saving_to_database( self ):
		self.gameModel.team1_points = self.game.players[0].score
		self.gameModel.team2_points = self.game.players[2].score
		super.saving_to_database( )

  

async def launch_game( consumers, mode):
	if mode == TWO_PLAYERS:
		server = TwoPlayerGame( consumers, mode )
	else:
		server = MultiPlayerGame( consumers, mode )
		
	await server.setup(  )
	await server.loop(  )
	await server.results(  )

