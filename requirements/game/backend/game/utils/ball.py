import random
from .objects import GameObject
from dataclasses import dataclass

TWO_PLAYERS = 2
MULTI_PLAYERS = 4

class Ball( GameObject ):
	def reset( self ):
		self.velocity.x *= random.choice([-1, 1])
		self.velocity.z *= random.choice([-1, 1]) 

	def update_z_velocity(self):
		self.velocity.z *= -1
		if self.velocity.z < 0 and self.velocity.z > -0.1:
			self.velocity.z -= .01
		elif self.velocity.z > 0 and self.velocity.z < 0.1:
			self.velocity.z += .01

	def check_ground_sides( self, plane ):
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity.x *= -1

	def check_out_ground( self, plane, p1, p2 ):
		if (  self.back >= plane.back ):
			p2.score+= 1
			self.reset()
		elif (  self.front <=  plane.front):
			p1.score += 1
			self.reset()
   
	def check_player_collision( self, p1, p2):
		if (self.back >= p1.front):
			if (self.right >= p1.left and self.left <= p1.right):
				self.update_z_velocity()

		elif (self.front <= p2.back):
			if (self.right >= p2.left and self.left <= p2.right):
				self.update_z_velocity()

	def update(self, plane, players):
		self.updateBounds()

		self.check_ground_sides( plane ) # does a perfect job
		self.check_out_ground( plane, players ) # sometimes get out ground for no reason, up: fixed
		self.check_player_collision( players ) # sometime reset when not needed

		for i in range( self.mode ):
			self.position[i] += self.velocity[i]
