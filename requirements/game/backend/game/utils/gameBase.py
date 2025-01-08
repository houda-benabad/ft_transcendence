import random
from dataclasses import dataclass, asdict, astuple
from .player import Player
from .ball import Ball
import math
from .objects import Plane
# from asgiref.sync import async_to_sync, sync_to_async

WINNING_SCORE = 2


@dataclass
class Vector3:
    x: float
    y: float
    z: float

class Game():
	def __init__( self ):
	#  P V D
		self.ball = Ball( Vector3( 0 , 0, 0), Vector3( .01,-.07,.1 ), Vector3( .2,.2,.2 ) )
		self.ball.velocity.x *= random.choice([-1, 1]) 
		self.ball.velocity.z *= random.choice([-1, 1])
		self.plane = Plane( Vector3(0,0,0), Vector3(.01,.01,.05), Vector3(4,.2,6) )

		self.players = [ Player( Vector3( 0, 0,self.plane.dimension.z/2),  Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ),
		Player( Vector3( 0, 0,-self.plane.dimension.z/2), Vector3( 0,-.1,.05 ), Vector3( 1,.3,.1 ) ) ]

	def update(self):
		for player in self.players:
			player.update()
		self.ball.update(self.plane, self.players )

	async def is_over(self):
		return any( player.score == WINNING_SCORE for player in self.players )

	def get_coordinates(self):
		coords = { "ball" :{ "position": astuple( self.ball.position ) } }
		for i, player in enumerate( self.players ):
			coords[f"p{i+1}"] = { "position" : astuple( player.position ) }
		return coords

	def move_players(self, consumers):
		for player, consumer in zip( self.players, consumers ):
			player.move( consumer.keycode, self.plane )
			consumer.keycode = 0

  
	def end_game_results(self, hoster, invited, gameModel):
		gameModel.player1_points = self.players[0].score
		gameModel.player2_points = self.players[1].score

		hoster.playerModel.total_games += 1
		invited.playerModel.total_games += 1
  
		hoster.playerModel.total_points += self.players[0].score
		invited.playerModel.total_points += self.players[1].score


		if (invited.keycode == -1 or self.players[0].score > self.players[1].score):
			hoster.game_result = "won"
			invited.game_result = "lost"
			gameModel.winner = hoster.playerModel
			hoster.playerModel.level = round( math.sqrt( hoster.playerModel.total_points ) * .7, 2)
			print( "level = ", hoster.playerModel.level)
		elif (self.players[0].score < self.players[1].score):
			invited.game_result = "won"
			hoster.game_result = "lost"
			invited.playerModel.level =  round(math.sqrt( invited.playerModel.total_points ) * .7, )
			print( "level = ", hoster.playerModel.level)
			gameModel.winner = invited.playerModel

