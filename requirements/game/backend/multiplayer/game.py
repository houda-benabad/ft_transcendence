from . import models, consumers
import json, time, asyncio, random
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from .utils.gameBase import Game
from .utils.gameBase import Game


async def startGame(channel_layer, consumers):
	game = Game()
	while True:
		#  ELEMETS UPDATE
		game.update()

		if any(consumer.keycode == -1 for consumer in consumers):
			break
		
		# MOVEMENT 
		game.move_players(consumers)
		for consumer in consumers:
			consumer.keycode = 0 
	
		# GAME OVER CHECK
		

		# SEND ALL INFO (COORDINATES = SCORE)	
		await channel_layer.group_send(consumers[0].game_group_name,
			{
				'type': 'api',
				'data': {
					'coordinates' : game.get_coordinates(),
		}
			}
		)

		await channel_layer.group_send(consumers[0].game_group_name,
			{
				'type': 'score',
				'data': {
					'p1' : {
						'name' : 'team1',
						'score' : game.p1.score
					},
					'p2' : {
						'name' : 'team1',
						'score' : game.p3.score
					},
				}
			}
		)
		if await game.is_game_over():
			break
		await asyncio.sleep(0.04)

	game.end_game_results(consumers[0], consumers[2])

	for i in range(len(consumers)):
		print( 'msg sent to player ', i)
		if i < 2:
			state = consumers[0].game_result
		else:
			state = consumers[2].game_result
		await consumers[i].send(text_data=json.dumps({
			'type' : 'endGame',
			'data' :{
				'state' : state,
			} 
		}))
