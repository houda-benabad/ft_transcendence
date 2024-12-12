import random
from .player import Player
from .ball import Ball
from .gameObjects import Plane


class Game():
	def __init__(self):
		#  P V D
		self.ball = Ball( [ 0 ,  0 ], [ .01,.05 ], [ .2,.2,.2 ] )
		self.ball.velocity[0] *= random.choice([-1, 1]) 
		self.ball.velocity[1] *= random.choice([-1, 1])
		self.plane = Plane([0,0], [.01,.01,.05], [5,.2,7])

		self.p1 = Player([1.5,self.plane.dimension[2]/2], [0,-.1,.05], [1,.3,.1])
		self.p2 = Player([-1.5,self.plane.dimension[2]/2], [0,-.1,.05], [1,.3,.1])
  
		self.p3 = Player([-1.5,-self.plane.dimension[2]/2], [0,-.1,.05], [1,.3,.1])
		self.p4 = Player([1.5,-self.plane.dimension[2]/2], [0,-.1,.05], [1,.3,.1])
  
		self.players = [self.p1, self.p2, self.p3, self.p4]

	def update(self):
		self.p1.updateBounds()
		self.p2.updateBounds()
		self.p3.updateBounds()
		self.p4.updateBounds()
		self.ball.update(self.plane, self.players)

	async def is_game_over(self):
		return any(player.score >= 6 for player in self.players)

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
