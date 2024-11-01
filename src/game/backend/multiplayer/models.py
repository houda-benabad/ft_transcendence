from django.db import models

# Create your models


class Game(models.Model):
	class status(models.TextChoices):
		STARTED = "STARTED", "started"
		WAITING = "WAITING" , "waiting"
 
	settings = models.JSONField(null=True)

	created_at = models.DateTimeField(auto_now=True)
	player_count = models.IntegerField(default=0)

	gameStatus = models.CharField(max_length=7, choices=status.choices, default='')

	def __str__(self):
		return f"{self.pk}"




class Player(models.Model):
	class status(models.TextChoices):
		W = "W", "W"
		L = "L" , "L"
 
	name = models.CharField(max_length=50)
	is_host = models.BooleanField(default=False)
	game = models.ForeignKey("Game" , on_delete=models.CASCADE, null=True)
	game_result = models.CharField(max_length=1,choices=status.choices, default='L')
	def __str__(self):
		return f"{self.name}{self.pk}"
