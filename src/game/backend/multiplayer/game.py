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
	
	def move(self, keycode, plane, p2):
         
		target = self.position[0]
		if keycode == 37 and self.position[0] > -plane.dimension[0] / 2 + self.dimension[0] / 2 :
			target -= 1
		elif keycode == 39 and self.position[0] < plane.dimension[0] / 2 - self.dimension[0] / 2 :
			target += 1
		new_pos = self.position[0] + (target - self.position[0]) * 0.1
		if abs(new_pos - p2.position[0]) >= self.dimension[0]:
			self.position[0] = new_pos
		
class Ball(GameObject):
	def reset(self):
		self.position = [0, 0]
		self.velocity[0] *= random.choice([-1, 1]) 
		self.velocity[1] *= random.choice([-1, 1])

	def update_z_velocity(self):
		self.velocity[1] *= -1
		if self.velocity[1] < 0 and self.velocity[1] > -0.1:
			self.velocity[1] -= .01
		elif self.velocity[1] > 0 and self.velocity[1] < 0.1:
			self.velocity[1] += .01
		

	def check_first_team(self, player):
		if (round(self.back, 4) >= round(player.front, 4)):
			return self.left >= player.left and self.right <= player.right
	
	def check_sec_team(self, player):
		if (round(self.front, 4) <= round(player.back, 4)):
			return self.left >= player.left and self.right <= player.right

	def update(self, plane, players):
		self.updateBounds()

		# # HANDLE PLANE SPACE DONE
		if (self.back >= plane.back):
			players[2].score+= 1
			players[3].score+= 1
			self.reset()
		elif (self.front <= plane.front):
			players[0].score += 1
			players[1].score += 1
			self.reset()

		# Handle wall collisions
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity[0] *= -1


		# # HANDLE PLAYERS COLLITSION

		if self.check_first_team(players[0]) or self.check_first_team(players[1]):
				self.update_z_velocity()

		if self.check_sec_team(players[2]) or self.check_sec_team(players[3]):
				self.update_z_velocity()

		for i in range(2):
			self.position[i] += self.velocity[i]

class Game():
	def __init__(self):
		#  P V D
		self.ball = Ball( [ 0 ,  0 ], [ .01,.05 ], [ .2,.2,.2 ] )
		self.ball.velocity[0] *= random.choice([-1, 1]) 
		self.ball.velocity[1] *= random.choice([-1, 1])
		self.plane = Plane([0,0], [.01,.01,.05], [6,.2,5])

		self.p1 = Player([1.5,2.45], [0,-.1,.05], [1,.3,.1])
		self.p2 = Player([-1.5,2.45], [0,-.1,.05], [1,.3,.1])
  
		self.p3 = Player([-1.5,-2.45], [0,-.1,.05], [1,.3,.1])
		self.p4 = Player([1.5,-2.45], [0,-.1,.05], [1,.3,.1])
  
		self.players = [self.p1, self.p2, self.p3, self.p4]

	def update(self):
		self.p1.updateBounds()
		self.p2.updateBounds()
		self.p3.updateBounds()
		self.p4.updateBounds()
		self.ball.update(self.plane, self.players)

	async def is_game_over(self):
		return any(player.score >= 2 for player in self.players)

	def get_coordinates(self):
		return{
			"ball" :{
	   			"position": self.ball.position
		  	},
			"p1":{
				"position":self.players[0].position, 
			},
   			"p2":{
				"position":self.players[1].position, 
			},
			"p3":{
				"position":self.players[2].position, 
			},
			"p4":{
				"position":self.players[3].position, 
			},
		}

	def move_players(self, consumers):
		self.p1.move(consumers[0].keycode, self.plane, self.p2)
		self.p2.move(consumers[1].keycode, self.plane, self.p1)
		self.p3.move(consumers[2].keycode, self.plane, self.p4)
		self.p4.move(consumers[3].keycode, self.plane, self.p3)
  
	def end_game_results(self, hoster, invited):
		print(self.p1.score ,'==' , self.p3.score)
		print(self.p2.score ,'==' , self.p4.score)
		if (invited.keycode == -1 or self.p1.score > self.p3.score):
			hoster.game_result = "won"
			invited.game_result = "lost"
		elif (self.p1.score < self.p3.score):
			invited.game_result = "won"
			hoster.game_result = "lost"

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
