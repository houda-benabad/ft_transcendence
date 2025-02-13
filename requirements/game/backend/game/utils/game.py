import json, asyncio, uuid
from .gameBase import Game
from asgiref.sync import async_to_sync, sync_to_async
from .. import models
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from .constants import *


class GameServer(  ):
	def __init__( self, consumers, mode ):
		self.mode = mode
		self.channel_layer = get_channel_layer(  )
		self.consumers = consumers
		self.game = Game( self.mode )

	async def __send_group_msg_( self, type, data ):
		await self.channel_layer.group_send( self.group_name,
			{
				'type': type,
				'data': data
			}
		)

	async def setup( self ):
		if self.mode == TWO_PLAYERS :
			self.gameModel = await sync_to_async( models.RemoteGame.objects.create )( 
				player1=self.consumers[0].playerModel,
				player2=self.consumers[1].playerModel
			)
		elif self.mode == MULTI_PLAYERS :
			self.gameModel = await sync_to_async( models.MultiplayerGame.objects.create )( 
				player1=self.consumers[0].playerModel,
				player2=self.consumers[1].playerModel,
				player3=self.consumers[2].playerModel,
				player4=self.consumers[3].playerModel
			)
		self.group_name = f"game-{self.gameModel.id}"
	
		for consumer in self.consumers:
			consumer.game_group_name = self.group_name
			await self.channel_layer.group_add( self.group_name, consumer.channel_name )

	def get_score(  self ):
		if self.mode == TWO_PLAYERS :
			return {
				'name' :{
					'p1' :	self.consumers[0].playerModel.username,
					'p2' :	self.consumers[1].playerModel.username
				},
				'score' :{
					'p1' : self.game.players[0].score,
					'p2' : self.game.players[1].score,
				},
				'ids':{
					'p1' : self.consumers[0].playerModel.userId,
					'p2' : self.consumers[1].playerModel.userId,
				}
			}
		elif self.mode == MULTI_PLAYERS :
			return {
				'score' :{
					'p1' : self.game.players[0].score,
					'p2' : self.game.players[2].score,
				},
				'ids':{
					'p1' : self.consumers[0].playerModel.userId,
					'p2' : self.consumers[1].playerModel.userId,
					'p3' : self.consumers[2].playerModel.userId,
					'p4' : self.consumers[3].playerModel.userId,
				}
			}
 		
	async def run( self ):
		await self.__send_group_msg_( 'start', self.get_score( ) )

		while True:
			self.game.update( )

			if ( any( consumer.keycode == -1 for consumer in self.consumers )):
				break
			
			self.game.move_players( self.consumers )
			

			await self.__send_group_msg_( 'api', self.game.get_coordinates() )
			await self.__send_group_msg_( 'score', self.get_score(  ) )
			if await self.game.is_over():
				break

			await asyncio.sleep( GAME_TICK_RATE )
			
   
	@database_sync_to_async
	def saving_to_database( self ):
		if self.mode == TWO_PLAYERS:
			self.gameModel.player1_points = self.game.players[0].score
			self.gameModel.player2_points = self.game.players[1].score
		elif self.mode == MULTI_PLAYERS:
			self.gameModel.team1_points = self.game.players[0].score
			self.gameModel.team2_points = self.game.players[2].score
	
		for i, consumer in enumerate( self.consumers ):
			consumer.playerModel.total_games += 1
			consumer.playerModel.total_points += self.game.players[i].score
		for consumer in self.consumers :
			consumer.playerModel.save()

		self.gameModel.save()

	async def send_results( self ):
		self.game.end_game_results(self.consumers, self.gameModel)
		for consumer in self.consumers:
			await consumer._send_message_( 'endGame',{ 'state' : consumer.game_result } )



async def startRemoteGame( consumers, mode):
	server = GameServer( consumers, mode )

	await server.setup(  )

	await asyncio.sleep( GAME_START_DELAY )

	await server.run(  )
	await server.send_results(  )
	await server.saving_to_database(  )


