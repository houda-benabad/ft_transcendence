# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from .models import Notification
# from .utils import *
# import requests
# from django.conf import settings

# class NotifConsumer(AsyncWebsocketConsumer):

# 	async def setup( self ) -> None:
# 		try:
# 			self.group_name = f"group_{self.username}"
# 			await self.channel_layer.group_add( self.group_name, self.channel_name )
# 			notifications = await get_all_notifications( self.username )
# 			await self.send( text_data=json.dumps(notifications) )
# 		except Exception as e:
# 			print( f"setup failed: {e}" )
# 			self.close( 400 )

# 	async def connect( self ):
# 		try:
# 			await self.accept(  )
# 		except Exception as e:
# 			print( f"Connection failed: {e}")
# 			self.close( 400 )

# 	async def send_notification_( self, data ):
# 		group_name = f"group_{data['receiver']}"
# 		notification = await create_notification( self.username, data )
# 		serialized_notification = serialize_notifications( notification, many=False)
# 		await self.channel_layer.group_send( group_name,{
# 			"type" : 'send_notification',
# 			'data' : serialized_notification
# 		} )

# 	@database_sync_to_async
# 	def get_notification_info( self, notification ):
# 		return notification.sender.username

# 	async def update_notification( self, data ):
# 		print( f"update called {data}" )
# 		notification_id = data["notification_id"]
# 		notification = await database_sync_to_async( Notification.objects.get )( id=notification_id )
# 		notification.status = data['status']
# 		await database_sync_to_async( notification.save )()
# 		await self.send_confirmation(  notification )


# 	async def send_confirmation( self, notification ):
# 		sender = await self.get_notification_info( notification )
# 		group_name = f"group_{sender}"
# 		# await self.send_notification_( json.dumps( notification ) )
# 		await self.group_send( text_data=json.dumps( {
# 			'type' : "update_notification",
# 			'data' : serialize_notifications( notification, many=False)
# 		} ))
	
# 	async def _handle_auth( self, token ):
# 		try:
# 			response = requests.get( settings.USER_INFO_URL + 'me', headers={"Host": "localhost", 'authorization': f"Bearer {token}" })
# 			print("token = ", token)
# 			if response.status_code != 200:
# 				self.disconnect( 404 )

# 			user_info = response.json(  )
# 			print("info = ", user_info)
# 			self.userId = user_info.get('id') , 
# 			self.username = user_info.get('username')
# 		except Exception as e:
# 			print( f"connection rejected : {e}" )

# 	async def receive(self, text_data):
# 		try:
# 			dataJson = json.loads(text_data)
# 			message_type = dataJson['type']
# 			data = dataJson["data"]
# 			if message_type == 'notification':
# 				print( "got a new notification" )
# 				await self.send_notification_( data )
# 			elif message_type == 'update':
# 				await self.update_notification( data )
# 			elif message_type == 'auth' :
# 				print(" toekn = ", dataJson['data'])
# 				await self._handle_auth( dataJson['data'])
# 				await self.setup(  )

# 		except Exception as e:
# 			print( f"Error happned: {e}")
# 			self.close( 400 )
  
# 	async def send_notification( self, event ):
# 		data = event.get( 'data' )
# 		await self.send( text_data=json.dumps({
# 			'type' : 'new notification',
# 			'data' : data
# 			}))
     

# 	async def disconnect(self, close_code):
# 		print( "disconnected" )



import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification
from .utils import *
import requests
from django.conf import settings

class NotifConsumer(AsyncWebsocketConsumer):
	async def connect( self ):
		await self.accept(  )

	async def receive(self, text_data):
		dataJson = json.loads(text_data)
		message_type = dataJson['type']
		data = dataJson["data"]
		if message_type == 'notification':
			await send_notification_( data, self.userId , self.token)

		elif message_type == 'auth' :
			self.token = dataJson['data']
			await self._handle_auth( )
			await self.setup(  )

	async def _handle_auth( self ):
		response = requests.get( settings.USER_INFO_URL + 'me', headers={"Host": "localhost", 'authorization': f"Bearer {self.token}" })
		if response.status_code != 200:
			self.disconnect( 404 )

		user_info = response.json(  )
		self.userId = user_info.get('id')
		self.username = user_info.get('username')
		print( f"user {self.username} with id = {self.userId} is connected")

	async def setup( self ) -> None:
		self.group_name = f"user_{self.userId}"
		await self.channel_layer.group_add( self.group_name, self.channel_name )
		notifications = await get_all_notifications( self.userId, self.token )
		await self.send( text_data=json.dumps({
			'type' : "all_notifications",
			'data' : notifications
		}) )
  
 
	async def send_notification( self, event ):
		data = event.get( 'data' )
		await self.send( text_data=json.dumps({
			'type' : 'new_notification',
			'data' : data
	}))
     

	async def disconnect(self, close_code):
		print( "disconnected" )