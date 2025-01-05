import random
from .objects import GameObject
from dataclasses import dataclass

TWO_PLAYERS = 2
MULTI_PLAYERS = 4

@dataclass
class Vector3:
    x: float
    y: float
    z: float


class Ball( GameObject ):
	def reset( self ):
		self.position = Vector3( 0, 0 ,0)
		self.velocity.x *= random.choice([-.5, .5])
		self.velocity.z *= random.choice([-.5, .5]) 

	def update_z_velocity(self):
		self.velocity.z *= -1
		MIN_VELOCITY = 0.1

		if self.velocity.z < 0 and self.velocity.z > -MIN_VELOCITY:
			self.velocity.z -= .01
		elif self.velocity.z > 0 and self.velocity.z < MIN_VELOCITY:
			self.velocity.z += .01

	def check_ground_sides( self, plane ):
		BUFFER = 0.01

		if self.left <= ( plane.left + BUFFER )or self.right >= ( plane.right - BUFFER ):
			self.velocity.x *= -1

	def check_out_ground( self, plane, players):
		if (  self.back >= plane.back ):
			players[1].score+= 1
			self.reset()
		elif (  self.front <=  plane.front):
			players[0].score += 1
			self.reset()
   
	def check_player_collision( self, players):
		if (self.back >= players[0].front):
			if (self.right >= players[0].left and self.left <= players[0].right):
				self.update_z_velocity()

		elif (self.front <= players[1].back):
			if (self.right >= players[1].left and self.left <= players[1].right):
				self.update_z_velocity()

	def update(self, plane, players):
		self.updateBounds()

		self.check_ground_sides( plane ) # does a perfect job
		self.check_out_ground( plane, players ) # sometimes get out ground for no reason, up: fixed
		self.check_player_collision( players ) # sometime reset when not needed

		for i in range( TWO_PLAYERS ):
			print( self.velocity.z, self.position.z )
			self.position.x += self.velocity.x
			self.position.z += self.velocity.z
