from django.db import models

# Create your models here.
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


