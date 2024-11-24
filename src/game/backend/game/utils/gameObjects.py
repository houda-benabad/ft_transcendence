from typing import List


class GameObject():
	position : List[float]
	dimension : List[float]
	velocity : List[float]

 
	def __init__(self,position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.updateBounds()

	def updateBounds(self) :
		self.back = self.position[1] + self.dimension[2] / 2
		self.front = self.position[1] - self.dimension[2] / 2

		self.left = self.position[0] - self.dimension[0] / 2
		self.right = self.position[0] + self.dimension[0] / 2
  

class Plane(GameObject):
	pass

