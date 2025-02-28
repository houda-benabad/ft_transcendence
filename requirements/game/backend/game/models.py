from django.db import models
from django.utils import timezone


class Player( models.Model ):
	username = models.CharField( max_length=30, blank=True )
	userId = models.PositiveIntegerField( blank=True, null=True  )
	total_points = models.PositiveIntegerField( default=0 )
	total_games = models.PositiveIntegerField( default=0 )
	level = models.FloatField( default=0 )
 
	def get_rank( self ):
		players = Player.objects.order_by( "-total_points" )
		return list(players).index(self) + 1

	def __str__( self ):
		return f"{self.username}"

class RemoteGame( models.Model ):
	date_time = models.DateTimeField( auto_now_add=True)
	player1 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='remote_player1_games' )
	player2 = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='remote_player2_games')
	player1_points = models.IntegerField( default=0 )
	player2_points = models.IntegerField( default=0 )
	winner = models.ForeignKey( "Player", on_delete=models.CASCADE, null=True, related_name='remote_winner'  )
	type = models.CharField( default='remote' , max_length=20 )

	def formatted_date_time(self):
		local_time = timezone.localtime(self.date_time)
		return local_time.strftime('%Y-%m-%d/ %H:%M')

	def get_point( self, player ):
		if not player:
			raise ValueError("Current player not found in serializer context")
		if (self.player1 == player):
			return self.player1_points
		if (self.player2 == player):
			return self.player2_points

	def get_status( self, player ):
		if not player:
			raise ValueError( 'Current player not found in serializer context' )
		if player == self.winner:
			return 'Won'
		return 'Lost'


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
	type = models.CharField( default='multiplayer' , max_length=20 )
 

	def formatted_date_time(self):
		local_time = timezone.localtime(self.date_time)
		return local_time.strftime('%Y-%m-%d/ %H:%M')

	def get_point( self, player  ):
		if self.player1 == player or self.player2 == player:
			return self.team1_points
		if self.player3 == player or self.player4 == player:
			return self.team2_points
	
	def get_status( self, player ):
		if player == self.winner1 or player == self.winner2:
			return 'Won'
		return 'Lost'

 
	def __str__( self ):
		return f"{self.player1} vs {self.player2}  at {self.date_time}"



