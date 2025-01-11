from rest_framework import serializers
from .models import Notification
import requests
from django.conf import settings


class NotificationSerializer( serializers.ModelSerializer ):
	sender = serializers.SerializerMethodField(  )

	def __init__( self, *args, **kwargs ):
		self.token = kwargs.pop( "token", None )
		super().__init__(*args, **kwargs)
	class Meta:
		model = Notification
		fields = [
			"id",
			"content",
			"sender",
			"time",
			"status"
			]
	
	def get_sender( self, obj ):
		response = requests.get( f"{settings.USER_INFO_URL}{obj.senderId}", headers={"Host": "localhost", 'authorization': f"Bearer {self.token}"})
		if response.status_code != 200:
			self.disconnect( 404 )
		senderJson = response.json( )
		return senderJson.get( "username" )