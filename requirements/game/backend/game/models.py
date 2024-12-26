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

class RemoteGame( models.Model ):
	date_time = models.DateTimeField( auto_now_add=True)
	player1 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='remote_player1_games' )
	player2 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='remote_player2_games')
	player1_points = models.IntegerField( default=0 )
	player2_points = models.IntegerField( default=0 )
	winner = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='remote_winner'  )

	def formatted_date_time(self):
		local_time = timezone.localtime(self.date_time)
		return local_time.strftime('%Y-%m-%d/ %H:%M')
 
	def __str__( self ):
		return f"{self.player1} vs {self.player2}  at {self.date_time}"


class MultiplayerGame( models.Model ):

	date_time = models.DateTimeField( auto_now_add=True)
	player1 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='multi_player1_games' )
	player2 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='multi_player2_games')
	player3 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='multi_player3_games')
	player4 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='multi_player4_games')
	team1_points = models.IntegerField( default=0 )
	team2_points = models.IntegerField( default=0 )
	winner1 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True  , related_name="multi_winner1")
	winner2 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True  , related_name="multi_winner2")

	def formatted_date_time(self):
		local_time = timezone.localtime(self.date_time)
		return local_time.strftime('%Y-%m-%d/ %H:%M')
 
	def __str__( self ):
		return f"{self.player1} vs {self.player2}  at {self.date_time}"



