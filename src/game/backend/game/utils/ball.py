import random
from .gameObjects import GameObject

class Ball(GameObject):
	def reset(self):
		self.position = [0, 0]
		self.velocity[1] *= random.choice([-1, 1])
		self.velocity[0] *= random.choice([-1, 1]) 

	def update_z_velocity(self):
		self.velocity[1] *= -1
		if self.velocity[1] < 0 and self.velocity[1] > -0.1:
			self.velocity[1] -= .01
		elif self.velocity[1] > 0 and self.velocity[1] < 0.1:
			self.velocity[1] += .01

	def check_ground_sides( self, plane ):
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity[0] *= -1

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

	def update(self, plane, p1, p2):
		self.updateBounds()

		self.check_ground_sides( plane ) # does a perfect job
		self.check_out_ground( plane, p1, p2 ) # sometimes get out ground for no reason, up: fixed
		self.check_player_collision( p1, p2 ) # does a perfect job 

		for i in range(2):
			self.position[i] += self.velocity[i]
