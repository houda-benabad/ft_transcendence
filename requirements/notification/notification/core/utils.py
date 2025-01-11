from asgiref.sync import  sync_to_async
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Notification
from .serializer import NotificationSerializer


async def create_notification( sender_username, data ):
	receiver = data['receiver']
	notification = await sync_to_async( Notification.objects.create )( 
		sender=await get_user( sender_username ),
		receiver=await get_user( receiver ),
		content=data['content']
    )
	await sync_to_async( notification.save )(  )
	return notification


@database_sync_to_async
def get_all_notifications( username ):
	user =  User.objects.get( username=username )
	notifications = Notification.objects.filter( receiver=user )
	data = serialize_notifications( notifications )
	return data

def serialize_notifications( notifications, many=True):
	serializer = NotificationSerializer(notifications, many=many)
	return serializer.data


async def get_user(  username ):
	return await sync_to_async( User.objects.get )( username=username )

	# async def send_notification_( self, data ):
	# 	group_name = f"group_{data['receiver']}"
	# 	notification = await create_notification( self.username, data )
	# 	serialized_notification = serialize_notifications( notification, many=False)
	# 	await self.channel_layer.group_send( group_name,{
	# 		"type" : 'send_notification',
	# 		'data' : serialized_notification
	# 	} )
 
 	# @database_sync_to_async
	# def get_notification_info( self, notification ):
	# 	return notification.sender.username

	# async def update_notification( self, data ):
	# print( f"update called {data}" )
	# notification_id = data["notification_id"]
	# notification = await database_sync_to_async( Notification.objects.get )( id=notification_id )
	# notification.status = data['status']
	# await database_sync_to_async( notification.save )()
	# await self.send_confirmation(  notification )
