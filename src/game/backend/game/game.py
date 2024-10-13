from . import models, consumers
import json, time, asyncio, random
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from typing import List

class GameObject():
	position : List[float]
	dimension : List[float]
	velocity : List[float]

 
	def __init__(self,position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.updateBounds()

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[1] / 2
		self.bottom = self.position[1] - self.dimension[1] / 2

		self.back = self.position[2] + self.dimension[2] / 2
		self.front = self.position[2] - self.dimension[2] / 2

		self.left = self.position[0] - self.dimension[0] / 2
		self.right = self.position[0] + self.dimension[0] / 2

class Plane(GameObject):
	pass

class Player(GameObject):
	score = 0

	def update(self, plane):
		self.velocity[1] += -0.01
		
		self.updateBounds()

		if (self.bottom > plane.top):
			self.position[1] += self.velocity[1]
		self.velocity[1] = 0
	
	def move(self, keycode, plane):
		target = self.position[0]
		if (keycode == 37 and self.position[0] > -plane.dimension[0] / 2 + self.dimension[0] / 2):
			target -= 0.5
		elif (keycode == 39 and self.position[0] < plane.dimension[0] / 2 - self.dimension[0] / 2):
			target += 0.5
		self.position[0] += (target - self.position[0]) * 0.1

class Ball(GameObject):

	def reset(self):
		self.position = [0, 0.8, 0]
		self.velocity = [random.uniform(-0.1, 0.1), 0.01, 0.05]

	def update(self, plane, player, otherplayer):
		self.updateBounds()
		self.velocity[1] += 0.03
		
		if (self.bottom <= plane.top):
			self.velocity[1] = 0

		if (self.left <= plane.left or self.right >= plane.right):
			self.velocity[0] *= -1
		
		
		if (self.back >= player.front and self.velocity[2] > 0):
			if ((self.left >= player.left - self.dimension[0] and self.right <= player.right + self.dimension[0]) or
				( player.left > self.position[0]  and player.left < self.right) or 
				( player.right < self.position[0]  and player.right > self.left)):

					hitpont = (self.position[0] - player.position[0]) / player.dimension[0]
					self.velocity[0] = hitpont * 0.05
					self.velocity[2] += 0.02
					self.velocity[2] *= -1

			else:
				otherplayer.score += 1
				self.reset()

		if (self.front <= otherplayer.back  and self.velocity[2] < 0):
			if (self.left >= otherplayer.left - self.dimension[0] and self.right <= otherplayer.right + self.dimension[0]) :
				hitpont = (self.position[0] - otherplayer.position[0]) / player.dimension[0]
				self.velocity[0] = hitpont * 0.05
				self.velocity[2] -= 0.02
				self.velocity[2] *= -1

			else:
				self.reset()
				player.score += 1

		self.position[0] += self.velocity[0]
		self.position[1] -= self.velocity[1]
		self.position[2] += self.velocity[2]


class Game():
	def __init__(self, settings):
    #  P V D
		self.ball = Ball( [ 0 , .8 , 0 ], [ random.uniform(-0.1, 0.1),.01,.01 ], [ .2,.2,.2 ] )
		self.plane = Plane([0,0,0], [.01,.01,.05], [3,.2,5])
		self.player = Player([0,.4,self.plane.dimension[2]/2 - .3], [0,-.1,.05], [1,.3,.3])
		self.otherPlayer = Player([0,.4,-self.plane.dimension[2]/2 + .3], [0,-.1,.05], [1,.3,.3])
		self.settings = settings
		self.goalTime =  int(self.settings['range'])
  

	def update(self):
		self.player.update(self.plane)
		self.otherPlayer.update(self.plane)
		self.ball.update(self.plane, self.player, self.otherPlayer)

	async def is_game_over(self, start_time, channel_layer):
		if (self.settings['mode'] == 'score'):
			goal =  int(self.settings['range'])
			return self.player.score == goal or self.otherPlayer.score == goal

		if (self.settings['mode'] == 'time'):
			elapsed = time.time() - start_time
			await channel_layer.group_send("invite",
			{
				'type': 'time',
				'data': int(elapsed)
			}
			)
			if (elapsed >= self.goalTime and self.player.score == self.otherPlayer.score):
				self.goalTime +=  5
			return elapsed >= self.goalTime

		return False

	def get_coordinates(self):
		return{
			"ball" :{
       			"position": self.ball.position
          	},
			"player":{
				"position":self.player.position, 
				"score":self.player.score
			},
			"otherPlayer":{
				"position": self.otherPlayer.position,
				"score": self.otherPlayer.score
				}
		}

	def move_players(self, hoster, invited):
		self.player.move(hoster.keycode, self.plane)
		self.otherPlayer.move(invited.keycode, self.plane)
  
	def end_game_results(self, hoster, invited):
		if (invited.keycode == -1 or self.player.score > self.otherPlayer.score):
			hoster.game_result = "W"
			invited.game_result = "L"
		elif (self.player.score < self.otherPlayer.score):
			invited.game_result = "W"
			hoster.game_result = "L"

async def startGame(channel_layer, hoster, invited):
	game = Game(hoster.game.settings)
	start = time.time()
	message = 'endGame'

	while True:
		#  ELEMETS UPDATE
		game.update()

		if (hoster.keycode == -1 or invited.keycode == -1):
			message = 'disconnect'
			break
		
		# MOVEMENT 
		game.move_players(hoster, invited)
		hoster.keycode= 0
		invited.keycode = 0
	
		# SEND TO FRONT
		await channel_layer.group_send("invite",
			{
				'type': 'coordinates',
				'data': game.get_coordinates()
			}
		)
		
		# GAME OVER CHECK
		if (await game.is_game_over(start, channel_layer)):
			break

		await asyncio.sleep(0.04)


	# SAVE TO DATABASE
	game.end_game_results(hoster, invited)



	await hoster.send(text_data=json.dumps({
		'type' : 'endGame',
		'data' :{
      		'state' : hoster.game_result,
			'by' : message
      	} 
	}))

	await invited.send(text_data=json.dumps({
		'type' : 'endGame',
		'data' :{
      		'state' : invited.game_result,
			'by' : message
      	} 
	}))
