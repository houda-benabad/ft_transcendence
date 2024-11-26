import random
from .player import Player
from .ball import Ball
from .gameObjects import Plane

class Game():
	def __init__(self):
	#  P V D
		self.ball = Ball( [ 0 ,  0 ], [ .01,-.07,.1 ], [ .2,.2,.2 ] )
		self.ball.velocity[0] *= random.choice([-1, 1]) 
		self.ball.velocity[1] *= random.choice([-1, 1])
		self.plane = Plane([0,0], [.01,.01,.05], [4,.2,6])

		self.p1 = Player([0,self.plane.dimension[2]/2], [0,-.1,.05], [1,.3,.1])
		self.p2 = Player([0,-self.plane.dimension[2]/2], [0,-.1,.05], [1,.3,.1])

	def update(self):
		self.p1.update()
		self.p2.update()
		self.ball.update(self.plane, self.p1, self.p2)

	async def is_game_over(self):
		return self.p1.score >= 10 or self.p2.score >= 10

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
