from django.db import models

# Create your models


class Game(models.Model):
	class gameType(models.TextChoices):
		TR = "TR",  "tournament"
		MP = "MP", "multiplayer"
		VS = "VS", "inviteFriend"

	class status(models.TextChoices):
		W = "W",  "win"
		L = "L", "lose"

	type = models.CharField(max_length=2, choices=gameType.choices, default='')
	created_at = models.DateTimeField(auto_now=True)

	gameStatus = models.CharField(max_length=1, choices=status.choices, default='')
	points = models.IntegerField(default=0)

	player_id = models.IntegerField()

	name = models.CharField(max_length=50)

	def __str__(self):
		return f"{self.pk}"




class Player(models.Model):
	name = models.CharField(max_length=50)

	def __str__(self):
		return f"{self.name}{self.pk}"
