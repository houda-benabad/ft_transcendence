from typing import List
from dataclasses import dataclass


@dataclass
class Vector3:
    x: float
    y: float
    z: float

class GameObject():
	position : Vector3
	dimension : Vector3
	velocity : Vector3

 
	def __init__(self,position, velocity, dimension):
		self.position = position
		self.velocity = velocity
		self.dimension = dimension
		self.updateBounds()

	def updateBounds(self) :
		self.back = self.position.z + self.dimension.z / 2
		self.front = self.position.z - self.dimension.z / 2

		self.left = self.position.x - self.dimension.x / 2
		self.right = self.position.x + self.dimension.x / 2
  

class Plane(GameObject):
	pass
