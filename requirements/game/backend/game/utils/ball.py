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

class Ball(GameObject):
	MIN_VELOCITY = 0.1  
    
	def reset(self):
		self.position = Vector3( 0, 0, 0)
		self.velocity.z *= random.choice([-1, 1])
		self.velocity.x *= random.choice([-1.1, 1.1]) 

	def adjust_z_velocity(self):
		self.velocity.z *= -1
		if self.velocity.z < 0 and self.velocity.z > -self.MIN_VELOCITY:
			self.velocity.z -= .01
		elif self.velocity.z > 0 and self.velocity.z < self.MIN_VELOCITY:
			self.velocity.z += .01

	def reflect_side_collision( self, plane ):
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity.x *= -1

	def handle_out_of_bounds_remote( self, plane, players ):
		if (  self.back >= plane.back + .05):
			players[1].score+= 1
			self.reset()
		elif (  self.front <=  plane.front - .05):
			players[0].score += 1
			self.reset()
   
	def handle_player_collision_remote( self, players ):

		if (self.back >= players[0].front and self.right >= players[0].left and self.left <= players[0].right):
				self.adjust_z_velocity()

		elif (self.front <= players[1].back and self.right >= players[1].left and self.left <= players[1].right):
				self.adjust_z_velocity()

	def update_position( self ):
		self.position.x += self.velocity.x
		self.position.z += self.velocity.z

	def update( self, plane, players ):
		self.updateBounds()

		self.reflect_side_collision( plane ) # does a perfect job
		# if mode == TWO_PLAYERS:
		self.handle_player_collision_remote( players ) # does a perfect job 
		self.handle_out_of_bounds_remote( plane, players ) # does  perfect job
		# else:
		# 	self.handle_player_collision_multi( players ) # does a perfect job 
		# 	self.handle_out_of_bounds_multi( plane, players ) # does  perfect job

		self.update_position(  )
		
