import json, asyncio, uuid
from .utils.gameBase import Game
from asgiref.sync import async_to_sync, sync_to_async
from . import models
from channels.layers import get_channel_layer

GAME_TICK_RATE = 0.02
GAME_START_DELAY = 5


class GameServer(  ):
	def __init__( self, consumers ):
		self.channel_layer = get_channel_layer(  )
		self.consumers = consumers
		self.game = Game(  )

	async def __send_group_msg_( self, type, data ):
		await self.channel_layer.group_send( self.group_name,
			{
				'type': type,
				'data': data
			}
		)

	async def setup( self ):
		self.gameModel = await sync_to_async( models.RemoteGame.objects.create )( 
			player1=self.consumers[0].playerModel,
			player2=self.consumers[1].playerModel
		)
	
		self.group_name = f"game-{self.gameModel.id}"
	
		for consumer in self.consumers:
			consumer.game_group_name = self.group_name
			await self.channel_layer.group_add( self.group_name, consumer.channel_name )
			

	async def _save_to_database( consumers ):
		game.end_game_results(consumers[0], consumers[1], gameModel)
		await sync_to_async( gameModel.save )()
		await sync_to_async( consumers[0].playerModel.save )()
		await sync_to_async( consumers[1].playerModel.save )()
		print( "Everythin is saved up")
		await consumers[0].send(text_data=json.dumps({
			'type' : 'endGame',
			'data' :{
				'state' : consumers[0].game_result,
			} 
		}))

		await consumers[1].send(text_data=json.dumps({
			'type' : 'endGame',
			'data' :{
				'state' : consumers[1].game_result,
			} 
		}))

	async def run( self ):
		await self.__send_group_msg_( 'start', 'game is starting' )

		while True:
			self.game.update()

			if ( any( consumer.keycode == -1 for consumer in self.consumers )):
				break
			
			# MOVEMENT 
			self.game.move_players(self.consumers[0], self.consumers[1])
			

			await self.__send_group_msg_( 'api', self.game.get_coordinates() )

			await self.channel_layer.group_send( self.group_name, 
			{
				'type': 'score',
				'data': {
					'name' :{
						'p1' :'kouaz',
						'p2' : 'hajar'
					},
					'score' :{
						'p1' : self.game.p1.score,
						'p2' : self.game.p2.score,
					}
			}
				}
			)
			# self.GAME OVER CHECK
			if await self.game.is_game_over():
				break

			await asyncio.sleep( GAME_TICK_RATE )


async def startRemoteGame( consumers):
	server = GameServer( consumers )

	await server.setup(  )

	await asyncio.sleep( GAME_START_DELAY )

	await server.run(  )
	# await server.saving_to_database(  )
	# await server.send_results(  )





# class GameServer(  ):
# 	def __init__( self, consumers ):
# 		self.channel_layer = get_channel_layer(  )
# 		self.consumers = consumers
# 		self.game = Game(  )


# 	async def _setup( self ):
# 		self.gameModel = await sync_to_async( models.RemoteGame.objects.create )(  
# 			player1=self.consumers[0].playerModel, 
# 			player2=self.consumers[1].playerModel
# 		)

# 		self.group_name = f"game_{self.gameModel.id}"
		
# 		for consumer in self.consumers:
# 			consumer.game_group_name = self.group_name 
# 			await self.channel_layer.group_add(consumer.game_group_name,consumer.channel_name)


# 	async def __send_group_msg_( self, type, data ):
# 		await self.channel_layer.group_send( self.group_name,
# 			{
# 				'type': type,
# 				'data': data
# 			}
# 		)


# 	async def run( self ):
# 		channel_layer = get_channel_layer( )

# 		await channel_layer.group_send(self.group_name,
# 		{
# 			'type': 'start',
# 			'data': "game is starting"
# 		})

# 		while True:

# 			self.game.update()
# 			if self.consumers[0].keycode == -1 or self.consumers[1].keycode == -1:
# 				break
			
# 			self.game.move_players( self.consumers )

# 			await self.__send_group_msg_( 'api', self.game.get_coordinates() )
# 			await self.__send_group_msg_( 'score', self.get_score(  ))

# 			if await self.game.is_over():
# 				break

# 			await asyncio.sleep( GAME_TICK_RATE )


# 	def get_score(  self, ):
# 		return {
# 			'name' :{
# 				'p1' :	self.consumers[0].playerModel.username,
# 				'p2' :	self.consumers[1].playerModel.username
# 			},
# 			'score' :{
# 				'p1' : self.game.players[0].score,
# 				'p2' : self.game.players[1].score,
# 			}
# 		}


# 	async def saving_to_database( self ):
	
# 		self.game.end_game_results(self.consumers[0], self.consumers[1], self.gameModel)

# 		await sync_to_async( self.gameModel.save )()
# 		await sync_to_async( self.consumers[0].playerModel.save )()
# 		await sync_to_async( self.consumers[1].playerModel.save )()


# 	async def send_results( self ):
# 		await self.consumers[0]._send_message_( 'endGame',{ 'state' : self.consumers[0].game_result } )
# 		await self.consumers[1]._send_message_( 'endGame',{ 'state' : self.consumers[1].game_result } )

# async def startRemoteGame( consumers):
# 	server = GameServer( consumers )

# 	await server._setup(  )

# 	await asyncio.sleep( GAME_START_DELAY )

# 	await server.run(  )
# 	await server.saving_to_database(  )
# 	await server.send_results(  )

