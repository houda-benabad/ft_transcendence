import  random
from .gameObjects import GameObject

class Ball(GameObject):
	def reset(self):
		self.position = [0, 0]
		self.velocity[0] *= random.choice([-1, 1]) 
		self.velocity[1] *= random.choice([-1, 1])

	def update_z_velocity(self):
		self.velocity[1] *= -1
		if self.velocity[1] < 0 and self.velocity[1] > -0.1:
			self.velocity[1] -= .01
		elif self.velocity[1] > 0 and self.velocity[1] < 0.1:
			self.velocity[1] += .01
		

	def check_first_team(self, player):
		if (round(self.back, 4) >= round(player.front, 4)):
			return self.left >= player.left and self.right <= player.right
	
	def check_sec_team(self, player):
		if (round(self.front, 4) <= round(player.back, 4)):
			return self.left >= player.left and self.right <= player.right

	def update(self, plane, players):
		self.updateBounds()

		# # HANDLE PLANE SPACE DONE
		if (self.back >= plane.back):
			players[2].score+= 1
			players[3].score+= 1
			self.reset()
		elif (self.front <= plane.front):
			players[0].score += 1
			players[1].score += 1
			self.reset()

		# Handle wall collisions
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity[0] *= -1


		# # HANDLE PLAYERS COLLITSION

		if self.check_first_team(players[0]) or self.check_first_team(players[1]):
				self.update_z_velocity()

		if self.check_sec_team(players[2]) or self.check_sec_team(players[3]):
				self.update_z_velocity()

		for i in range(2):
			self.position[i] += self.velocity[i]
