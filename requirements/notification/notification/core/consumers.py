import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification
from .utils import *


class NotifConsumer(AsyncWebsocketConsumer):

	async def setup( self ) -> None:
		try:
			self.username =  self.scope['url_route']['kwargs']['username']
			self.group_name = f"group_{self.username}"
			await self.channel_layer.group_add( self.group_name, self.channel_name )
		except Exception as e:
			print( f"setup failed: {e}" )
			self.close( 400 )

	async def connect( self ):
		try:
			await self.accept(  )
			await self.setup(  )
			if self.username:
				notifications = await get_all_notifications( self.username )
				await self.send( text_data=json.dumps(notifications) )
		except Exception as e:
			print( f"Connection failed: {e}")
			self.close( 400 )

	async def send_notification_( self, data ):
		group_name = f"group_{data['receiver']}"
		notification = await create_notification( self.username, data )
		serialized_notification = serialize_notifications( notification, many=False)
		await self.channel_layer.group_send( group_name,{
			"type" : 'send_notification',
			'data' : serialized_notification
		} )

	@database_sync_to_async
	def get_notification_info( self, notification ):
		return notification.sender.username

	async def update_notification( self, data ):
		print( f"update called {data}" )
		notification_id = data["notification_id"]
		notification = await database_sync_to_async( Notification.objects.get )( id=notification_id )
		notification.status = data['status']
		await database_sync_to_async( notification.save )()
		await self.send_confirmation(  notification )
		print( "Done" )

	async def send_confirmation( self, notification ):
		sender = await self.get_notification_info( notification )
		group_name = f"group_{sender}"
		# await self.send_notification_( json.dumps( notification ) )
		await self.group_send( text_data=json.dumps( {
			'type' : "update_notification",
			'data' : serialize_notifications( notification, many=False)
		} ))
  

	async def receive(self, text_data):
		try:
			dataJson = json.loads(text_data)
			message_type = dataJson['type']
			data = dataJson["data"]
			print( "data = ", data )
			if message_type == 'notification':
				print( "got a new notification" )
				await self.send_notification_( data )
			elif message_type == 'update':
				await self.update_notification( data )

		except Exception as e:
			print( f"Error happned: {e}")
			self.close( 400 )
  
	async def send_notification( self, event ):
		data = event.get( 'data' )
		await self.send( text_data=json.dumps({
			'type' : 'new notification',
			'data' : data
			}))
     

	async def disconnect(self, close_code):
		print( "disconnected" )