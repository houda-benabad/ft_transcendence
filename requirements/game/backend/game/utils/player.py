from .objects import GameObject

class Player(GameObject):
	score = 0

	def update(self):
		
		self.updateBounds()
	
	def move(self, keycode, plane):
		target = self.position.x
		if (keycode == 40 and self.position.x > -plane.dimension.x / 2 + self.dimension.x / 2):
			target = -0.09
		elif (keycode == 38 and self.position.x < plane.dimension.x / 2 - self.dimension.x / 2):
			target = 0.09
		else:
			target = 0
		self.position.x += target