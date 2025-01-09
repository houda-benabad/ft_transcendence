import random
from dataclasses import dataclass, asdict, astuple
from .player import Player
from .ball import Ball
import math
from .objects import Plane

TWO_PLAYERS = 2
MULTI_PLAYERS = 4


WINNING_SCORE = 2


@dataclass
class Vector3:
    x: float
    y: float
    z: float

class Game():
    # GENERIC
	def __init__( self, mode ):
		#  P V D
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


	# GENERIC
	def update(self):
		for player in self.players:
			player.update()
		self.ball.update(self.plane, self.players, self.mode )

	# GENERIC
	async def is_over(self):
		return any( player.score == WINNING_SCORE for player in self.players )

	# GENERIC
	def get_coordinates(self):
		coords = { "ball" :{ "position": astuple( self.ball.position ) } }
		for i, player in enumerate( self.players ):
			coords[f"p{i+1}"] = { "position" : astuple( player.position ) }
		return coords

	# GENERIC
	def move_players(self, consumers):
		if self.mode == TWO_PLAYERS:
			for player, consumer in zip( self.players, consumers):
				player.move( consumer, self.plane, TWO_PLAYERS )
		elif self.mode == MULTI_PLAYERS:
			self.players[0].move( consumers[0], self.plane, MULTI_PLAYERS, self.players[1] )
			self.players[1].move( consumers[1], self.plane, MULTI_PLAYERS, self.players[0] )
			self.players[2].move( consumers[2], self.plane, MULTI_PLAYERS, self.players[3] )
			self.players[3].move( consumers[3], self.plane, MULTI_PLAYERS, self.players[2] )

	# STILL SOME ISSUES
	def end_game_results(self, consumers, gameModel):

		if self.mode == TWO_PLAYERS:
			if (consumers[1].keycode == -1 or self.players[0].score > self.players[1].score):
				consumers[0].game_result = "won"
				consumers[1].game_result = "lost"
				gameModel.winner = consumers[0].playerModel
				consumers[0].playerModel.level = round( math.sqrt( consumers[0].playerModel.total_points ) * .7, 2)
			elif (self.players[0].score < self.players[1].score):
				consumers[1].game_result = "won"
				consumers[0].game_result = "lost"
				consumers[1].playerModel.level =  round(math.sqrt( consumers[1].playerModel.total_points ) * .7, )
				gameModel.winner = consumers[1].playerModel

		elif self.mode == MULTI_PLAYERS:
			if ( consumers[0].keycode == -1 or consumers[1].keycode == -1 or self.players[0].score > self.players[2].score):
				consumers[0].game_result = "won"
				consumers[1].game_result = "won"
				consumers[2].game_result = "lost"
				consumers[3].game_result = "lost"
				gameModel.winner1 = consumers[0].playerModel
				gameModel.winner2 = consumers[1].playerModel
				consumers[0].playerModel.level = round( math.sqrt( consumers[0].playerModel.total_points ) * .5, 2)
				consumers[1].playerModel.level = round( math.sqrt( consumers[1].playerModel.total_points ) * .5, 2)
			elif (self.players[0].score < self.players[1].score):
				consumers[0].game_result = "lost"
				consumers[1].game_result = "lost"
				consumers[2].game_result = "won"
				consumers[3].game_result = "won"
				gameModel.winner1 = consumers[2].playerModel
				gameModel.winner2 = consumers[3].playerModel
				consumers[2].playerModel.level = round( math.sqrt( consumers[2].playerModel.total_points ) * .5, 2)
				consumers[3].playerModel.level = round( math.sqrt( consumers[3].playerModel.total_points ) * .5, 2)