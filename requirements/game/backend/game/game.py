import json, asyncio, uuid
from .utils.gameBase import Game
from asgiref.sync import async_to_sync, sync_to_async
from . import models

async def startGame(channel_layer, hoster, invited):
	id = uuid.uuid4()
	group_name = f"game-{id}"
	hoster.game_group_name = group_name
	invited.game_group_name = group_name 
 
	print( "hoster = ", hoster.game_group_name)
	print( "invited = ", invited.game_group_name)

	await channel_layer.group_add(hoster.game_group_name,hoster.channel_name)
	await channel_layer.group_add(invited.game_group_name,invited.channel_name)

	gameModel = await sync_to_async( models.Game.objects.create )( 
        player1=hoster.playerModel,
        player2=invited.playerModel
    )
	await asyncio.sleep(5)

	await channel_layer.group_send(group_name,
	{
		'type': 'start',
		'data': "game is starting"
	}
	)
	game = Game()
	while True:
		#  ELEMETS UPDATE
		game.update()

		if (hoster.keycode == -1 or invited.keycode == -1):
			break
		
		# MOVEMENT 
		game.move_players(hoster, invited)
		
  
	
			# SEND ALL INFO (COORDINATES = SCORE = TIME)
		await channel_layer.group_send( group_name,
				{
					'type': 'api',
					'data': {
						'coordinates' : game.get_coordinates(),
			}
				}
			)

		await channel_layer.group_send( group_name, 
		{
			'type': 'score',
			'data': {
				'name' :{
					'p1' :'kouaz',
					'p2' : 'hajar'
				},
				'score' :{
					'p1' : game.p1.score,
					'p2' : game.p2.score,
				}
		}
			}
		)
		# GAME OVER CHECK
		if await game.is_game_over():
			break

		await asyncio.sleep(0.02)


	# SAVE TO DATABASE
	game.end_game_results(hoster, invited, gameModel)
	await sync_to_async( gameModel.save )()
	await sync_to_async( hoster.playerModel.save )()
	await sync_to_async( invited.playerModel.save )()
	print( "Everuthin is saved up")
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
