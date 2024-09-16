from . import models, consumers
import json, time, asyncio, random, math
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer

class Plane():
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

class Player():
	def __init__(self,position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.score = 0
		self.updateBounds()

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[1] / 2
		self.bottom = self.position[1] - self.dimension[1] / 2

		self.back = self.position[2] + self.dimension[2] / 2
		self.front = self.position[2] - self.dimension[2] / 2

		self.left = self.position[0] - self.dimension[0] / 2
		self.right = self.position[0] + self.dimension[0] / 2

	def update(self, plane):
		self.velocity[1] += -0.01
		
		self.updateBounds()

		if (self.bottom > plane.top):
			self.position[1] += self.velocity[1]
		self.velocity[1] = 0

class Ball():

	def __init__(self, position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.updateBounds()

	def reset(self):
		self.position = [0, 0.8, 0]
		self.velocity = [0.01, 0.01, 0.05]

	def updateBounds(self) :
		self.top= self.position[1] + self.dimension[0]
		self.bottom = self.position[1] - self.dimension[0]
		self.back = self.position[2] + self.dimension[0]
		self.front = self.position[2] - self.dimension[0]
		self.left = self.position[0] - self.dimension[0]
		self.right = self.position[0] + self.dimension[0]

	def update(self, plane, players):
		self.updateBounds()
		self.velocity[1] += 0.03
		
		if (self.bottom <= plane.top):
			self.velocity[1] = 0

		if (self.left <= plane.left or self.right >= plane.right):
			self.velocity[0] *= -1
		
		for i in range(len(players)):
			
			if (self.back >= players[i].front and i <= 1):
				if ((self.left >= players[i].left - self.dimension[0] and self.right <= players[i].right + self.dimension[0]) or
					( players[i].left > self.position[0]  and players[i].left < self.right) or 
					( players[i].right < self.position[0]  and players[i].right > self.left)):

						hitpont = (self.position[0] - players[i].position[0]) / players[i].dimension[0]
						self.velocity[0] = hitpont * 0.05
						self.velocity[2] += 0.01
						self.velocity[2] *= -1

			# else:
			# 	self.reset()

			if (self.front <= players[i].back and i > 1):
				if (self.left >= players[i].left - self.dimension[0] and self.right <= players[i].right + self.dimension[0]) :
					hitpont = (self.position[0] - players[i].position[0]) / players[i].dimension[0]
					self.velocity[0] = hitpont * 0.05
					self.velocity[2] -= 0.01
					self.velocity[2] *= -1

			# else:
			# 	self.reset()

		self.position[0] += self.velocity[0]
		self.position[1] -= self.velocity[1]
		self.position[2] += self.velocity[2]


def distance(pos1, pos2):
	return math.sqrt(math.pow((pos1[0] - pos2[0]), 2) + math.pow((pos1[1] - pos2[1]), 2) +math.pow((pos1[2] - pos2[2]), 2) )


async def startGame(channel_layer, players):
	# 			position,  		 velocity,   		 dimension,         mOde (player)
	#			   x    y   z	    x   y   z		 x  y  z	
	ball = Ball( [ 0 , .8 , 0 ], [ .01 , .01 , .01 ], [ .2 , 32 , 15 ] )
	plane = Plane( [ 0 , 0 , 0 ], [ .01 , .01 , .05 ], [ 5 , .2 , 5 ])

	player1 = Player( [ plane.dimension[0]/2 - .5, .4 , plane.dimension[2]/2 - .3 ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
	player2 = Player( [ -plane.dimension[0]/2 + .5 , .4 , plane.dimension[2]/2 - .3 ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])


	player3 = Player( [ plane.dimension[0]/2 - .5, .4 , -(plane.dimension[2]/2 - .3) ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
	player4 = Player( [ -plane.dimension[0]/2 + .5 , .4 , -(plane.dimension[2]/2 - .3) ], [ 0 , -.1 , .05 ], [ 1 , .3 , .3 ])
	actualplayers = [player1, player2]
	actualplayers = [player1, player2, player3, player4]
	while True:
	#  ELEMETS UPDATE
		player1.update(plane)
		player2.update(plane)
		player3.update(plane)
		player4.update(plane)
		ball.update(plane, actualplayers)
		# ball.update(plane, player1, player2)

	# MOVEMENT 

		# PLAYER MOVEMENT
		for i in range(len(players)):
			if (players[i].keycode == 37):
					actualplayers[i].position[0] -= 0.2
			elif (players[i].keycode == 39):
				actualplayers[i].position[0] += 0.2
			players[i].keycode = 0
		# break

	# SCORE 

	# SEND TO FRONT
		allCoordinate = {
				"ball" :{"position": ball.position},
				"player1":{
					"position":player1.position, 
			  		"score":player1.score
				},
				"player2":{
					"position": player2.position,
					"score": player2.score
					},
				"player3":{
					"position": player3.position,
					"score": player3.score
					},
				"player4":{
					"position": player4.position,
					"score": player4.score
					}
		}
		await channel_layer.group_send("test",
			{
				'type': 'create_msg',
				'data': allCoordinate
			}
		)

		await asyncio.sleep(0.04)
		if (player1.score > 2 or player2.score > 2):
			break

	# SAVE TO DATABASE
	# if (player1.score > player2.score):
	# 	first.match.gameStatus = "W"
	# 	second.match.gameStatus = "L"
	# else:
	# 	second.match.gameStatus = "W"
	# 	first.match.gameStatus = "L"

	# await sync_to_async(first.match.save)()
	# await sync_to_async(second.match.save)()