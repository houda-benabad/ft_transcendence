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
		self.back = self.position[1] + self.dimension[2] / 2
		self.front = self.position[1] - self.dimension[2] / 2

		self.left = self.position[0] - self.dimension[0] / 2
		self.right = self.position[0] + self.dimension[0] / 2

class Plane(GameObject):
	pass

class Player(GameObject):
	score = 0

	def update(self, plane):
		
		self.updateBounds()
	
	def move(self, keycode, plane):
		target = self.position[0]
		if (keycode == 37 and self.position[0] > -plane.dimension[0] / 2 + self.dimension[0] / 2):
			target -= 1
		elif (keycode == 39 and self.position[0] < plane.dimension[0] / 2 - self.dimension[0] / 2):
			target += 1
		self.position[0] += (target - self.position[0]) * 0.1

class Ball(GameObject):
	def reset(self):
		self.position = [0, 0]
		rand = 1
		if (random.randint(0, 1)% 2 == 0):
			rand = -1
		self.velocity[1] *= rand 

 
	def update_z_velocity(self):
		self.velocity[1] *= -1
		if self.velocity[1] < 0 and self.velocity[1] > -0.1:
			self.velocity[1] -= .01
		elif self.velocity[1] > 0 and self.velocity[1] < 0.1:
			self.velocity[1] += .01

	def update(self, plane, player, otherplayer):
		self.updateBounds()

		# # HANDLE PLANE SPACE DONE
		if (self.back >= plane.back):
			otherplayer.score+= 1
			self.reset()
		elif (self.front <= plane.front):
			player.score += 1
			self.reset()

		# Handle wall collisions
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity[0] *= -1

		# # HANDLE PLAYERS COLLITSION

		if (round(self.back, 4) >= round(player.front, 4)):
			if (self.left >= player.left and self.right <= player.right):
				self.update_z_velocity()

		elif (round(self.front, 4) <= round(otherplayer.back, 4)):
			if (self.left >= otherplayer.left and self.right <= otherplayer.right):
				self.update_z_velocity()

		for i in range(2):
			self.position[i] += self.velocity[i]

class Game():
	def __init__(self, settings):
	#  P V D
		self.ball = Ball( [ 0 ,  0 ], [ .01,-.01,.03 ], [ .2,.2,.2 ] )
		self.plane = Plane([0,0], [.01,.01,.05], [3,.2,5])

		self.player = Player([0,2.45], [0,-.1,.05], [1,.3,.1])
		self.otherPlayer = Player([0,-2.45], [0,-.1,.05], [1,.3,.1])

		self.settings = settings
		self.goalTime =  int(self.settings['range'])
  

	def update(self):
		self.player.update(self.plane)
		self.otherPlayer.update(self.plane)
		self.ball.update(self.plane, self.player, self.otherPlayer)

	async def is_game_over(self, start_time):
		if (self.settings['mode'] == 'score'):
			goal =  int(self.settings['range'])
			return self.player.score == goal or self.otherPlayer.score == goal

		if (self.settings['mode'] == 'time'):
			elapsed = time.time() - start_time
			if (elapsed >= self.goalTime and self.player.score == self.otherPlayer.score):
				self.goalTime +=  5
			return elapsed >= self.goalTime 

		return False

	def get_time(self, start_time):
		return  int(time.time() - start_time)

	def get_coordinates(self):
		return{
			"ball" :{
	   			"position": self.ball.position
		  	},
			"player":{
				"name" : 'hajar',
				"position":self.player.position, 
				"score":self.player.score
			},
			"otherPlayer":{
				"name" : 'kouaz',
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
  
	
		# GAME OVER CHECK
		if await game.is_game_over(start):
			break
			# SEND ALL INFO (COORDINATES = SCORE = TIME)
		if game.settings['mode'] == 'time' :
			await channel_layer.group_send(hoster.game_group_name,
				{
					'type': 'api',
					'data': {
						'coordinates' : game.get_coordinates(),
						'time' : game.get_time(start)
			}
				}
			)
		else:
			
			await channel_layer.group_send(hoster.game_group_name,
				{
					'type': 'api',
					'data': {
						'coordinates' : game.get_coordinates(),
			}
				}
			)

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
