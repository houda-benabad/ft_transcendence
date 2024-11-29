from django.db import models

# Create your models


class Game(models.Model):
	class STATUS(models.TextChoices):
		WON = "LOST", "won"
		LOST = "WON" , "lost"

	created_at = models.DateTimeField(auto_now=True)
	type = models.CharField(max_length=50, default='Remote')
	status = models.CharField(max_length=7, choices=STATUS.choices, default='')

	def __str__(self):
		return f"{self.pk}"




class Player(models.Model):
 
	name = models.CharField(max_length=50)
	game = models.ForeignKey("Game" , on_delete=models.CASCADE, null=True)
	def __str__(self):
		return f"{self.name}{self.pk}"
