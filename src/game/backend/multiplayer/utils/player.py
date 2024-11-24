from .gameObjects import GameObject

class Player(GameObject):
	score = 0
	
	def move(self, keycode, plane, p2):
         
		target = self.position[0]
		if keycode == 40 and self.position[0] > -plane.dimension[0] / 2 + self.dimension[0] / 2 :
			target -= 1
		elif keycode == 38 and self.position[0] < plane.dimension[0] / 2 - self.dimension[0] / 2 :
			target += 1
		new_pos = self.position[0] + (target - self.position[0]) * 0.1
		if abs(new_pos - p2.position[0]) >= self.dimension[0]:
			self.position[0] = new_pos
		
