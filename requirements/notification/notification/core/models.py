from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Notification( models.Model ):
	class statusChoices(models.TextChoices):
		S = "seen"
		D = "delivred"
	senderId = models.IntegerField( null=True, blank=True)
	receiverId = models.IntegerField( null=True, blank=True)
	content = models.TextField( max_length=150 , default="sent you a playing request")
	time = models.TimeField( auto_now_add=True)
	status = models.CharField( choices=statusChoices, default=statusChoices.D, max_length=10 )
 
	def __str__(self):
		return f"notification{self.id}"