from . import models, consumers
import json, time, asyncio, random
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from typing import List
import uuid


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

	def update(self):
		
		self.updateBounds()
	
	def move(self, keycode, plane):
		target = self.position[0]
		if (keycode == 37 and self.position[0] > -plane.dimension[0] / 2 + self.dimension[0] / 2):
			target = -0.05
		elif (keycode == 39 and self.position[0] < plane.dimension[0] / 2 - self.dimension[0] / 2):
			target = 0.05
		else:
			target = 0
		self.position[0] += target

class Ball(GameObject):
	def reset(self):
		self.position = [0, 0]
		self.velocity[1] *= random.choice([-1, 1])
		self.velocity[0] *= random.choice([-1, 1]) 

	def update_z_velocity(self):
		self.velocity[1] *= -1
		if self.velocity[1] < 0 and self.velocity[1] > -0.1:
			self.velocity[1] -= .01
		elif self.velocity[1] > 0 and self.velocity[1] < 0.1:
			self.velocity[1] += .01

	def update(self, plane, p1, p2):
		self.updateBounds()

		# # HANDLE PLANE SPACE DONE
		if (self.back >= plane.back):
			p2.score+= 1
			self.reset()
		elif (self.front <= plane.front):
			p1.score += 1
			self.reset()

		# Handle wall collisions
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity[0] *= -1

		# # HANDLE p1S COLLITSION

		if (round(self.back, 4) >= round(p1.front, 4)):
			if (self.left >= p1.left and self.right <= p1.right):
				self.update_z_velocity()

		elif (round(self.front, 4) <= round(p2.back, 4)):
			if (self.left >= p2.left and self.right <= p2.right):
				self.update_z_velocity()
		for i in range(2):
			self.position[i] += self.velocity[i]

class Game():
	def __init__(self):
	#  P V D
		self.ball = Ball( [ 0 ,  0 ], [ .01,-.01,.04 ], [ .2,.2,.2 ] )
		self.ball.velocity[0] *= random.choice([-1, 1]) 
		self.ball.velocity[1] *= random.choice([-1, 1])
		self.plane = Plane([0,0], [.01,.01,.05], [3,.2,5])

		self.p1 = Player([0,2.45], [0,-.1,.05], [1,.3,.1])
		self.p2 = Player([0,-2.45], [0,-.1,.05], [1,.3,.1])

	def update(self):
		self.p1.update()
		self.p2.update()
		self.ball.update(self.plane, self.p1, self.p2)

	async def is_game_over(self):
		return self.p1.score >= 2 or self.p2.score >= 2

	def get_coordinates(self):
		return{
			"ball" :{
	   			"position": self.ball.position
		  	},
			"p1":{
				"position":self.p1.position, 
			},
			"p2":{
				"position": self.p2.position,
				}
		}

	def move_players(self, hoster, invited):
		self.p1.move(hoster.keycode, self.plane)
		self.p2.move(invited.keycode, self.plane)
  
	def end_game_results(self, hoster, invited):
		if (invited.keycode == -1 or self.p1.score > self.p2.score):
			hoster.game_result = "won"
			invited.game_result = "lost"
		elif (self.p1.score < self.p2.score):
			invited.game_result = "won"
			hoster.game_result = "lost"

async def startGame(channel_layer, hoster, invited):
	await asyncio.sleep(3)
	id = uuid.uuid4()
	hoster.game_group_name = f"game-{id}"
	invited.game_group_name = f"game-{id}"

	await channel_layer.group_add(hoster.game_group_name,hoster.channel_name)
	await channel_layer.group_add(invited.game_group_name,invited.channel_name)
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
