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


	def update(self):
		for player in self.players:
			player.update()
		self.ball.update(self.plane, self.players, self.mode )

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
			base = ['won', 'lost']
			if (consumers[1].keycode == -1 or self.players[0].score > self.players[1].score):

				self.players[1].score = 0
				for consumer, state in zip( consumers, base ):
					consumer.game_result = state
				gameModel.winner = consumers[0].playerModel
			else:
				self.players[1].score = 0
				for consumer, state in zip( consumers, reversed(base) ):
					consumer.game_result = state
				gameModel.winner = consumers[1].playerModel

			gameModel.winner.level =  round(math.sqrt( consumers[1].playerModel.total_points ) * .9, 2)

		elif self.mode == MULTI_PLAYERS:
			base = ['won', 'won', 'lost', 'lost']
			if ( consumers[2].keycode == -1 or consumers[3].keycode == -1 or self.players[0].score > self.players[2].score):
				self.players[2].score = 0
				self.players[3].score = 0

				for consumer, state in zip( consumers, base ):
					consumer.game_result = state
				gameModel.winner1 = consumers[0].playerModel
				gameModel.winner2 = consumers[1].playerModel
			else:
				self.players[0].score = 0
				self.players[1].score = 0
				for consumer, state in zip( consumers, reversed(base) ):
					consumer.game_result = state
				gameModel.winner1 = consumers[2].playerModel
				gameModel.winner2 = consumers[3].playerModel

			gameModel.winner1.level = round( math.sqrt( consumers[2].playerModel.total_points ) * .7, 2)
			gameModel.winner2.level = round( math.sqrt( consumers[3].playerModel.total_points ) * .7, 2)