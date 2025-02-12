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
	MIN_VELOCITY = 0.05  
    
    # GENERIC
	def __reset(self):
		self.position = Vector3( 0, 0, 0)
		self.velocity.z *= random.choice([-1, 1])
		self.velocity.x *= random.choice([-1.03, 1.03]) 

	def calculate_hit_position(self,  paddle):
		paddle_center_x = paddle.position.x + paddle.dimension.x / 2
		hit_position = (self.position.x - paddle_center_x) / (paddle.dimension.x / 2)
		return max(-1, min(1, hit_position))

	#GENERIC
	def __adjust_z_velocity(self, paddle):
    
		self.velocity.z *= -1
  
		self.velocity.z += self.calculate_hit_position( paddle ) * 0.01 
  
		if 0 > self.velocity.z > -self.MIN_VELOCITY:
			self.velocity.z -= .01
		elif 0 < self.velocity.z < self.MIN_VELOCITY:
			self.velocity.z += .01

	#GENERIC
	def __reflect_side_collision( self, plane ):
		if self.left <= plane.left or self.right >= plane.right:
			self.velocity.x *= -1
	
	# NON GENERIC BUT GOOD
	def __handle_out_of_bounds_remote( self, plane, players ):
		if (  self.back >= plane.back + .05):
			players[1].score+= 1
			self.__reset()
		elif (  self.front <=  plane.front - .05):
			players[0].score += 1
			self.__reset()
   
	# NON GENERIC BUT GOOD
	def __handle_player_collision_remote( self, players ):

		if (self.back >= players[0].front and self.right >= players[0].left and self.left <= players[0].right):
				self.__adjust_z_velocity( players[0])

		elif (self.front <= players[1].back and self.right >= players[1].left and self.left <= players[1].right):
				self.__adjust_z_velocity( players[1])

	# NON GENERIC BUT GOOD
	def __handle_out_of_bounds_multi( self, plane, players ):
		if (  self.back >= plane.back + .05):
			players[2].score+= 1
			players[3].score+= 1
			self.__reset()
		elif (  self.front <=  plane.front - .05):
			players[0].score += 1
			players[1].score += 1
			self.__reset()
   
	# NON GENERIC BUT GOOD
	def __single_team1_collision( self, player) :
		return self.back >= player.front and self.right >= player.left and self.left <= player.right

	def __single_team2_collision( self, player) :
		return self.front <= player.back and self.right >= player.left and self.left <= player.right
   
	# NON GENERIC BUT GOOD
	def __handle_player_collision_multi( self, players ):
			if self.__single_team1_collision( players[0] ) or self.__single_team1_collision( players[1] ):
				self.__adjust_z_velocity(  )
			if self.__single_team2_collision( players[2] ) or self.__single_team2_collision( players[3] ):
				self.__adjust_z_velocity(  )

	# GENERIC
	def __update_position( self ):
		self.position.x += self.velocity.x
		self.position.z += self.velocity.z

	# GENERIC
	def update( self, plane, players, mode ):
		self.updateBounds()

		self.__reflect_side_collision( plane )
		if mode == TWO_PLAYERS:
			self.__handle_player_collision_remote( players ) 
			self.__handle_out_of_bounds_remote( plane, players )
		elif mode == MULTI_PLAYERS :
			self.__handle_player_collision_multi( players )
			self.__handle_out_of_bounds_multi( plane, players )

		self.__update_position(  )
		