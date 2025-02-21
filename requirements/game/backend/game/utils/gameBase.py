import random
from dataclasses import dataclass, asdict, astuple
from .player import Player
from .ball import Ball
import math
from .objects import Plane
from .constants import *


@dataclass
class Vector3:
    x: float
    y: float
    z: float

class Game():
	def __init__( self, mode ):
		self.mode = mode
		self.ball = Ball( Vector3( 0 , 0, 0), Vector3( .05,-.07,.1 ), Vector3( .2,.2,.2 ) )
		self.ball.velocity.x *= random.choice([-1, 1]) 
		self.ball.velocity.z *= random.choice([-1, 1])

		if self.mode == TWO_PLAYERS :
			self.plane = Plane( Vector3(0,0,0), Vector3(.01,.01,.05), Vector3(4,.2,6) )
		elif self.mode == MULTI_PLAYERS :
			self.plane = Plane( Vector3(0,0,0), Vector3(.01,.01,.05), Vector3(5,.2,7) )

		if self.mode == TWO_PLAYERS :
			self.players = [ Player( Vector3( 0, 0,self.plane.dimension.z/2 ),  Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ),
							 Player( Vector3( 0, 0,-self.plane.dimension.z/2), Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ) ]
		elif self.mode == MULTI_PLAYERS :
			self.players = [ Player( Vector3( 1.5, 0, (self.plane.dimension.z )/2  ) ,Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ),
							 Player( Vector3( -1.5, 0, (self.plane.dimension.z )/2 ), Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ),
							 Player( Vector3( -1.5, 0, -(self.plane.dimension.z )/2), Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ),
							 Player( Vector3( 1.5, 0, -(self.plane.dimension.z )/2 ), Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ) ]


	async def update(self):
		for player in self.players:
			player.update()
		await self.ball.update(self.plane, self.players, self.mode )

	async def is_over(self):
		return any( player.score == WINNING_SCORE for player in self.players )

	def get_coordinates(self):
		coords = { "ball" :{ "position": astuple( self.ball.position ) } }
		for i, player in enumerate( self.players ):
			coords[f"p{i+1}"] = { "position" : astuple( player.position ) }
		return coords

	def move_players(self, consumers):
		if self.mode == TWO_PLAYERS:
			for player, consumer in zip( self.players, consumers):
				player.move( consumer, self.plane, TWO_PLAYERS )
		elif self.mode == MULTI_PLAYERS:
			self.players[0].move( consumers[0], self.plane, MULTI_PLAYERS, self.players[1] )
			self.players[1].move( consumers[1], self.plane, MULTI_PLAYERS, self.players[0] )
			self.players[2].move( consumers[2], self.plane, MULTI_PLAYERS, self.players[3] )
			self.players[3].move( consumers[3], self.plane, MULTI_PLAYERS, self.players[2] )

	def end_game_results(self, consumers, gameModel):
		if self.mode == TWO_PLAYERS:
			if consumers[1].keycode == -1 or consumers[0].keycode == -1:
				base = ['Other player discarded', 'You lost']
				loser_index = 0 if consumers[0].keycode == -1 else 1
				winner_index = 1 - loser_index
    
				self.players[loser_index].score = 0
				for consumer, state in zip(consumers, base if loser_index == 1 else reversed(base)):
					consumer.game_result = state
				
				gameModel.winner = consumers[winner_index].playerModel
			else:
				base = ['You won', 'You lost']
				winner_index = 0 if self.players[0].score > self.players[1].score else 1
				for consumer, state in zip(consumers, base if winner_index == 0 else reversed(base)):
					consumer.game_result = state
				gameModel.winner = consumers[winner_index].playerModel

			gameModel.winner.level =  round(math.sqrt( gameModel.winner.total_points ) * .9, 2)

		elif self.mode == MULTI_PLAYERS:
			base = ['You won', 'You won', 'You lost', 'You lost']
   
			if any( consumer.keycode == -1 for consumer in consumers ):
				loser_index = [0,1] if consumers[0].keycode == -1 or consumers[1].keycode == -1 else [2, 3]
			else:
				loser_index = [0,1] if self.players[0].score < self.players[2].score else [2, 3]
			winner_index = [i for i in range(4) if i not in loser_index]
				
			for i in loser_index:
					self.players[i].score = 0


			for consumer, state in zip(consumers, base if loser_index == [2,3] else reversed(base)):
				consumer.game_result = state


			gameModel.winner1 = consumers[winner_index[0]].playerModel if consumers[winner_index[0]] else None
			gameModel.winner2 = consumers[winner_index[1]].playerModel if consumers[winner_index[1]] else None

			if gameModel.winner1 and gameModel.winner2:
				gameModel.winner1.level = round(math.sqrt(gameModel.winner1.total_points) * .7, 2)
				gameModel.winner2.level = round(math.sqrt(gameModel.winner2.total_points) * .7, 2)