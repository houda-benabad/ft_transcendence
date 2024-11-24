import json, asyncio, uuid
from .utils.gameBase import Game


async def startGame(channel_layer, hoster, invited):
	id = uuid.uuid4()
	hoster.game_group_name = f"game-{id}"
	invited.game_group_name = f"game-{id}"

	await channel_layer.group_add(hoster.game_group_name,hoster.channel_name)
	await channel_layer.group_add(invited.game_group_name,invited.channel_name)
	await asyncio.sleep(3)
	game = Game()
	while True:
		#  ELEMETS UPDATE
		game.update()

		if (hoster.keycode == -1 or invited.keycode == -1):
			break
		
		# MOVEMENT 
		game.move_players(hoster, invited)
		hoster.keycode= 0
		invited.keycode = 0
  
	
			# SEND ALL INFO (COORDINATES = SCORE = TIME)
		await channel_layer.group_send(hoster.game_group_name,
				{
					'type': 'api',
					'data': {
						'coordinates' : game.get_coordinates(),
			}
				}
			)

		await channel_layer.group_send(hoster.game_group_name, 
		{
				'type': 'score',
				'data': {
					'p1' :{
						'name' : 'kouaz',
						'score' : game.p1.score,
         				} ,
					'p2' :{
						'name' : 'hajar',
						'score' : game.p2.score,
         				} ,
		}
			}
		)
		# GAME OVER CHECK
		if await game.is_game_over():
			break

		await asyncio.sleep(0.02)


	# SAVE TO DATABASE
	game.end_game_results(hoster, invited)



	await hoster.send(text_data=json.dumps({
		'type' : 'endGame',
		'data' :{
	  		'state' : hoster.game_result,
	  	} 
	}))

	await invited.send(text_data=json.dumps({
		'type' : 'endGame',
		'data' :{
	  		'state' : invited.game_result,
	  	} 
	}))
