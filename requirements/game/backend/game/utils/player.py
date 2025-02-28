from .objects import GameObject

TWO_PLAYERS = 2
MULTI_PLAYERS = 4


class Player(GameObject):
	score = 0

	def update(self):
		
		self.updateBounds()
	
	def move(self, consumer, plane,  mode, player=None):
		if mode == TWO_PLAYERS:
			target = 0
			if consumer.keycode == 38 and self.position.x > -plane.dimension.x / 2 + self.dimension.x / 2 :
				target = -0.2
			elif (consumer.keycode == 40 and self.position.x < plane.dimension.x / 2 - self.dimension.x / 2 ):
				target = 0.2
			self.position.x += target
		if mode == MULTI_PLAYERS:
			target = self.position.x
			if consumer.keycode == 38 and self.position.x > -plane.dimension.x / 2 + self.dimension.x / 2 :
				target -= 0.2
			elif (consumer.keycode == 40 and self.position.x < plane.dimension.x / 2 - self.dimension.x / 2 ):
				target += 0.2
			new_pos = self.position.x + (target - self.position.x )
			if abs( new_pos - player.position.x ) >= self.dimension.x:
				self.position.x = new_pos
		consumer.keycode = 0

