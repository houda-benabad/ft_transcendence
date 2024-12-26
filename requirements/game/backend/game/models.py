from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Player( models.Model ):
	# user = models.ForeignKey( User, on_delete=models.CASCADE, null=True )
	userId = models.IntegerField( blank=True, null=True  )
	total_points = models.IntegerField( default=0 )
	total_games = models.IntegerField( default=0 )
	rank = models.IntegerField( default=0 )
	level = models.IntegerField( default=0 )

	def __str__( self ):
		return f"player-{self.userId}"

class Game( models.Model ):
	date_time = models.DateTimeField( auto_now_add=True)
	player1 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='player1_games' )
	player2 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='player2_games')
	player1_points = models.IntegerField( default=0 )
	player2_points = models.IntegerField( default=0 )
	winner = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True  )
	
	def formatted_date_time(self):
		local_time = timezone.localtime(self.date_time)
		return local_time.strftime('%Y-%m-%d/ %H:%M')
 
	def __str__( self ):
		return f"{self.player1} vs {self.player2}  at {self.date_time}"


