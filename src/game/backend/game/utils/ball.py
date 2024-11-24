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

	def update(self, plane, p1, p2):
		self.updateBounds()

		# # HANDLE PLANE SPACE DONE
		if (self.back >= plane.back):
			p2.score+= 1
			self.reset()
		elif (self.front <= plane.front):
			p1.score += 1
			self.reset()

		# Handle wall collisions
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity[0] *= -1

		# # HANDLE p1S COLLITSION

		if (round(self.back, 4) >= round(p1.front, 4)):
			if (self.left >= p1.left and self.right <= p1.right):
				self.update_z_velocity()

		elif (round(self.front, 4) <= round(p2.back, 4)):
			if (self.left >= p2.left and self.right <= p2.right):
				self.update_z_velocity()
		for i in range(2):
			self.position[i] += self.velocity[i]
